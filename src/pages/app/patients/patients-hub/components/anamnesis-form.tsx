"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getAnamnesis, saveAnamnesis, type AnamnesisData } from "@/api/anamnesis"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { pdf } from "@react-pdf/renderer"

import { AnamnesisHeader } from "./components/anamnesis-header"
import { AnamnesisToolbar } from "./components/anamnesis-toolbar"
import { AnamnesisEditorBlock } from "./components/anamnesis-editor-block"
import { AnamnesisSkeleton } from "./components/anamnesis-skeleton"
import { AnamnesisNavigation } from "./components/anamnesis-navigation"
import { AnamnesisPDFTemplate } from "@/utils/anamnesis-pdf-template"

import type { AnamnesisBlock, AnamnesisDraft, SectionAnchor } from "./components/types"
import {
    buildInitialBlocks,
    toApiData,
    buildContentFromBlocks,
    normalizeBlocks,
    createBlock,
} from "./components/anamnesis-utils"

export function AnamnesisForm({ patientId, patientName }: { patientId: string; patientName: string }) {
    const [blocks, setBlocks] = useState<AnamnesisBlock[]>([])
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
    const [hydrated, setHydrated] = useState(false)
    const [hasLocalDraft, setHasLocalDraft] = useState(false)
    const [copied, setCopied] = useState(false)
    const [pdfSuccess, setPdfSuccess] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})
    const lastPersistedHash = useRef("")
    const draftStorageKey = `anamnesis-draft:${patientId}`

    const { data, isLoading } = useQuery({
        queryKey: ["anamnesis", patientId],
        queryFn: () => getAnamnesis(patientId),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (newData: AnamnesisData) => saveAnamnesis(patientId, newData),
        onSuccess: (_, vars) => {
            lastPersistedHash.current = JSON.stringify(vars)
            setHasLocalDraft(false)
            localStorage.removeItem(draftStorageKey)
        },
        onError: () => toast.error("Erro ao sincronizar com o servidor.")
    })

    const normalizedBlocks = useMemo(() => normalizeBlocks(blocks), [blocks])
    const payload = useMemo(() => toApiData(normalizedBlocks), [normalizedBlocks])
    const content = useMemo(() => buildContentFromBlocks(normalizedBlocks), [normalizedBlocks])
    const payloadHash = JSON.stringify(payload)

    const sections = useMemo<SectionAnchor[]>(() =>
        normalizedBlocks.map((b, i) => ({ id: b.id, label: b.title || `Seção ${i + 1}` })),
        [normalizedBlocks]
    )

    useEffect(() => {
        if (!data) return

        const serverBlocks = normalizeBlocks(buildInitialBlocks(data))
        const serverHash = JSON.stringify(toApiData(serverBlocks))
        lastPersistedHash.current = serverHash

        let initial = serverBlocks

        try {
            const rawDraft = localStorage.getItem(draftStorageKey)
            if (rawDraft) {
                const parsed = JSON.parse(rawDraft) as AnamnesisDraft
                const parsedBlocks = Array.isArray(parsed?.blocks)
                    ? parsed.blocks.map((b, i) => createBlock(b, i))
                    : []

                if (parsedBlocks.length > 0) {
                    const draftHash = JSON.stringify(toApiData(parsedBlocks))
                    if (draftHash !== serverHash) {
                        initial = normalizeBlocks(parsedBlocks)
                        setHasLocalDraft(true)
                        toast.info("Rascunho local recuperado.")
                    }
                }
            }
        } catch {
            localStorage.removeItem(draftStorageKey)
        }

        setBlocks(initial)
        setActiveBlockId(initial[0]?.id ?? null)
        setHydrated(true)
    }, [data, draftStorageKey])

    useEffect(() => {
        if (!hydrated) return

        const draft: AnamnesisDraft = {
            blocks: normalizedBlocks,
            updatedAt: Date.now()
        }
        localStorage.setItem(draftStorageKey, JSON.stringify(draft))

        if (payloadHash !== lastPersistedHash.current) {
            setHasLocalDraft(true)
            const timer = setTimeout(() => mutate(payload), 1000)
            return () => clearTimeout(timer)
        }
    }, [payloadHash, hydrated, mutate, payload, normalizedBlocks, draftStorageKey])

    const handleUpdateBlock = (id: string, updates: Partial<AnamnesisBlock>) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
    }

    const handleAddBlock = () => {
        const newBlock: AnamnesisBlock = { id: crypto.randomUUID(), title: `Nova Seção`, content: "" }
        setBlocks(prev => [...prev, newBlock])
        setActiveBlockId(newBlock.id)

        setTimeout(() => {
            textareaRefs.current[newBlock.id]?.focus()
            textareaRefs.current[newBlock.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 50)
    }

    const handleApplyFormat = (marker: string) => {
        const targetId = activeBlockId || normalizedBlocks[0]?.id
        const textarea = textareaRefs.current[targetId!]
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const currentContent = textarea.value
        const selected = currentContent.slice(start, end)

        const nextText = `${currentContent.slice(0, start)}${marker}${selected}${marker}${currentContent.slice(end)}`
        handleUpdateBlock(targetId!, { content: nextText })

        requestAnimationFrame(() => {
            textarea.focus()
            const cursor = selected ? end + marker.length * 2 : start + marker.length
            textarea.setSelectionRange(cursor, cursor)
        })
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast.success("Copiado para a área de transferência.")
        } catch {
            toast.error("Erro ao copiar.")
        }
    }

    const handleGeneratePDF = async () => {
        if (!content.trim()) return
        setIsExporting(true)
        try {
            const generatedAt = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
            const blob = await pdf(
                <AnamnesisPDFTemplate patientName={patientName} content={content} generatedAt={generatedAt} />
            ).toBlob()

            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `Anamnese-${patientName.replace(/\s+/g, "-")}.pdf`
            link.click()
            URL.revokeObjectURL(url)

            setPdfSuccess(true)
            setTimeout(() => setPdfSuccess(false), 2000)
            toast.success("PDF baixado!")
        } catch (e) {
            toast.error("Erro ao gerar PDF.")
        } finally {
            setIsExporting(false)
        }
    }

    if (isLoading || !hydrated) return <AnamnesisSkeleton />

    return (
        <div className="w-full space-y-4">
            <div className="rounded-2xl bg-card p-5 border shadow-sm">
                <AnamnesisHeader
                    onGeneratePDF={handleGeneratePDF}
                    onCopy={handleCopy}
                    isExporting={isExporting}
                    isCopyDisabled={!content.trim()}
                    copied={copied}
                    pdfSuccess={pdfSuccess}
                />

                <div className="mt-4 space-y-4">
                    <AnamnesisToolbar
                        onFormat={handleApplyFormat}
                        onList={(prefix) => handleApplyFormat(prefix)}
                    />

                    <AnamnesisNavigation
                        sections={sections}
                        activeBlockId={activeBlockId}
                        onJump={(id) => {
                            setActiveBlockId(id)
                            textareaRefs.current[id]?.focus()
                            textareaRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }}
                    />

                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Registro Clínico</Label>
                        <Button size="sm" onClick={handleAddBlock} className="bg-emerald-600 hover:bg-emerald-700 h-8">
                            <Plus className="mr-1 h-4 w-4" /> Novo bloco
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {normalizedBlocks.map((block, index) => (
                            <AnamnesisEditorBlock
                                key={block.id}
                                block={block}
                                index={index}
                                isActive={activeBlockId === block.id}
                                isRemoveDisabled={normalizedBlocks.length <= 1}
                                onUpdate={handleUpdateBlock}
                                onRemove={(id) => setBlocks(prev => prev.filter(b => b.id !== id))}
                                onFocus={setActiveBlockId}
                                registerRef={(id, el) => {
                                    textareaRefs.current[id] = el
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between px-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                <span>Blocos: {normalizedBlocks.length}</span>
                <span>{isPending ? "Sincronizando..." : hasLocalDraft ? "Rascunho Local" : "Sincronizado"}</span>
            </div>
        </div>
    )
}