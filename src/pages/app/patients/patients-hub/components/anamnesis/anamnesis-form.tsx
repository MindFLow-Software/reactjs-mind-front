"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getAnamnesis, saveAnamnesis, type AnamnesisData } from "@/api/patients/anamnesis"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { pdf } from "@react-pdf/renderer"

import { AnamnesisHeader } from "./anamnesis-header"
import { AnamnesisToolbar } from "./anamnesis-toolbar"
import { AnamnesisEditorBlock } from "./anamnesis-editor-block"
import { AnamnesisSkeleton } from "./anamnesis-skeleton"
import { AnamnesisNavigation } from "./anamnesis-navigation"
import { AnamnesisPDFTemplate } from "@/utils/anamnesis-pdf-template"

import type { AnamnesisBlock, AnamnesisDraft } from "./anamnesis-types"
import {
    buildInitialBlocks,
    toApiData,
    buildContentFromBlocks,
    normalizeBlocks,
    createBlock,
} from "./anamnesis-utils"

function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length
}

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
        onError: () => toast.error("Erro ao sincronizar com o servidor."),
    })

    const normalizedBlocks = useMemo(() => normalizeBlocks(blocks), [blocks])
    const payload = useMemo(() => toApiData(normalizedBlocks), [normalizedBlocks])
    const content = useMemo(() => buildContentFromBlocks(normalizedBlocks), [normalizedBlocks])
    const payloadHash = JSON.stringify(payload)

    const wordCounts = useMemo(
        () => normalizedBlocks.map((b) => wordCount(b.content)),
        [normalizedBlocks],
    )

    const sections = useMemo(
        () =>
            normalizedBlocks.map((b, i) => ({
                id: b.id,
                label: b.title || `Seção ${i + 1}`,
                wordCount: wordCounts[i],
            })),
        [normalizedBlocks, wordCounts],
    )

    const saveStatus: "synced" | "pending" | "draft" = isPending
        ? "pending"
        : hasLocalDraft
        ? "draft"
        : "synced"

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

        const draft: AnamnesisDraft = { blocks: normalizedBlocks, updatedAt: Date.now() }
        localStorage.setItem(draftStorageKey, JSON.stringify(draft))

        if (payloadHash !== lastPersistedHash.current) {
            setHasLocalDraft(true)
            const timer = setTimeout(() => mutate(payload), 1000)
            return () => clearTimeout(timer)
        }
    }, [payloadHash, hydrated, mutate, payload, normalizedBlocks, draftStorageKey])

    const handleUpdateBlock = (id: string, updates: Partial<AnamnesisBlock>) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
    }

    const handleAddBlock = () => {
        const newBlock: AnamnesisBlock = { id: crypto.randomUUID(), title: "Nova Seção", content: "" }
        setBlocks((prev) => [...prev, newBlock])
        setActiveBlockId(newBlock.id)
        setTimeout(() => {
            textareaRefs.current[newBlock.id]?.focus()
            textareaRefs.current[newBlock.id]?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 50)
    }

    const handleApplyFormat = (marker: string) => {
        const targetId = activeBlockId || normalizedBlocks[0]?.id
        const textarea = textareaRefs.current[targetId!]
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const cur = textarea.value
        const selected = cur.slice(start, end)

        const next = `${cur.slice(0, start)}${marker}${selected}${marker}${cur.slice(end)}`
        handleUpdateBlock(targetId!, { content: next })

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
                <AnamnesisPDFTemplate patientName={patientName} content={content} generatedAt={generatedAt} />,
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
        } catch {
            toast.error("Erro ao gerar PDF.")
        } finally {
            setIsExporting(false)
        }
    }

    if (isLoading || !hydrated) return <AnamnesisSkeleton />

    return (
        <div className="w-full space-y-4">
            {/* PDF / Copy header */}
            <AnamnesisHeader
                onGeneratePDF={handleGeneratePDF}
                onCopy={handleCopy}
                isExporting={isExporting}
                isCopyDisabled={!content.trim()}
                copied={copied}
                pdfSuccess={pdfSuccess}
            />

            {/* Toolbar */}
            <AnamnesisToolbar
                onFormat={handleApplyFormat}
                onList={(prefix) => handleApplyFormat(prefix)}
                saveStatus={saveStatus}
            />

            {/* Sidebar + editor */}
            <div className="flex gap-4 items-start">
                <AnamnesisNavigation
                    sections={sections}
                    activeBlockId={activeBlockId}
                    onJump={(id) => {
                        setActiveBlockId(id)
                        textareaRefs.current[id]?.focus()
                        textareaRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" })
                    }}
                />

                <div className="flex-1 min-w-0 space-y-3">
                    {normalizedBlocks.map((block, index) => (
                        <AnamnesisEditorBlock
                            key={block.id}
                            block={block}
                            index={index}
                            isActive={activeBlockId === block.id}
                            isRemoveDisabled={normalizedBlocks.length <= 1}
                            saveStatus={saveStatus}
                            onUpdate={handleUpdateBlock}
                            onRemove={(id) => setBlocks((prev) => prev.filter((b) => b.id !== id))}
                            onFocus={setActiveBlockId}
                            registerRef={(id, el) => {
                                textareaRefs.current[id] = el
                            }}
                        />
                    ))}

                    <Button
                        size="sm"
                        onClick={handleAddBlock}
                        variant="outline"
                        className="w-full cursor-pointer border-dashed text-muted-foreground hover:text-foreground hover:border-border"
                    >
                        <Plus className="mr-1.5 h-4 w-4" /> Novo bloco
                    </Button>
                </div>
            </div>
        </div>
    )
}
