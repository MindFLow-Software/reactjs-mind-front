"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getAnamnesis, saveAnamnesis } from "@/api/anamnesis"
import type { AnamnesisData } from "@/api/anamnesis"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { pdf } from "@react-pdf/renderer"
import { Bold, Check, Copy, Highlighter, Italic, List, ListOrdered, Underline, FileDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AnamnesisPDFTemplate } from "@/utils/anamnesis-pdf-template"

const DYNAMIC_TEMPLATE_PREFIX = "__ANAMNESIS_BLOCKS_V1__:"
const SINGLE_BLOCK_TITLE = "Anamnese"

interface AnamnesisDraft {
    content: string
    updatedAt: number
}

interface SerializedBlock {
    id?: string
    title?: string
    content?: string
}

const ANAMNESIS_PLACEHOLDER = `Exemplos de estrutura:

- Queixa principal:
- Historia do problema atual:
- Contexto familiar e social:
- Antecedentes relevantes:
- Hipoteses clinicas:
- Plano terapeutico inicial:

Escreva livremente e use a barra de formatacao acima.`

function normalizeSingleEditorContent(content: string | undefined): string {
    if (!content) return ""
    return content.replace(/^(?:##\s*Anamnese\s*\n+)+/i, "").trim()
}

function buildInitialContent(data: AnamnesisData): string {
    const raw = data.medicalHistory ?? ""

    if (raw.startsWith(DYNAMIC_TEMPLATE_PREFIX)) {
        try {
            const parsed = JSON.parse(raw.slice(DYNAMIC_TEMPLATE_PREFIX.length)) as SerializedBlock[]
            if (Array.isArray(parsed) && parsed.length > 0) {
                if (parsed.length === 1) {
                    return normalizeSingleEditorContent(parsed[0]?.content)
                }

                return parsed
                    .map((block, index) => {
                        const title = block.title?.trim() || `Secao ${index + 1}`
                        const content = block.content?.trim() || ""
                        if (!content) return ""
                        const heading = `## ${title}`
                        return content.startsWith(heading) ? content : `${heading}\n${content}`
                    })
                    .filter(Boolean)
                    .join("\n\n")
            }
        } catch {
        }
    }

    const sections = [
        data.chiefComplaint ? `## Queixa Principal\n${data.chiefComplaint}` : "",
        data.familyHistory ? `## Historico Familiar\n${data.familyHistory}` : "",
        data.personalHistory ? `## Historico Pessoal\n${data.personalHistory}` : "",
        raw && !raw.startsWith(DYNAMIC_TEMPLATE_PREFIX) ? `## Historico Medico\n${raw}` : "",
    ].filter(Boolean)

    return sections.join("\n\n")
}

function toApiData(content: string): AnamnesisData {
    const clean = content.trim()
    const serialized = `${DYNAMIC_TEMPLATE_PREFIX}${JSON.stringify([
        {
            id: crypto.randomUUID(),
            title: SINGLE_BLOCK_TITLE,
            content,
        },
    ])}`

    return {
        chiefComplaint: clean,
        familyHistory: "",
        personalHistory: "",
        medicalHistory: serialized,
    }
}

function autoResize(textarea: HTMLTextAreaElement | null) {
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
}

export function AnamnesisTab({ patientId, patientName }: { patientId: string; patientName: string }) {
    const [content, setContent] = useState("")
    const [hydrated, setHydrated] = useState(false)
    const [hasLocalDraft, setHasLocalDraft] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const copiedTimerRef = useRef<number | null>(null)
    const lastPersistedHash = useRef("")
    const currentPayloadHash = useRef("")
    const draftStorageKey = `anamnesis-draft:${patientId}`

    const { data, isLoading } = useQuery({
        queryKey: ["anamnesis", patientId],
        queryFn: () => getAnamnesis(patientId),
    })

    useEffect(() => {
        if (!data) return

        const serverContent = buildInitialContent(data)
        const serverHash = JSON.stringify(toApiData(serverContent))
        lastPersistedHash.current = serverHash

        let initial = serverContent

        try {
            const rawDraft = localStorage.getItem(draftStorageKey)
            if (rawDraft) {
                const parsed = JSON.parse(rawDraft) as AnamnesisDraft
                if (typeof parsed?.content === "string") {
                    const draftHash = JSON.stringify(toApiData(parsed.content))
                    if (draftHash !== serverHash) {
                        initial = parsed.content
                        setHasLocalDraft(true)
                        toast.info("Rascunho local recuperado.")
                    }
                }
            }
        } catch {
            localStorage.removeItem(draftStorageKey)
        }

        setContent(initial)
        setHydrated(true)
    }, [data, draftStorageKey])

    const payload = useMemo(() => toApiData(content), [content])
    const payloadHash = useMemo(() => JSON.stringify(payload), [payload])
    currentPayloadHash.current = payloadHash

    const { mutate, isPending } = useMutation({
        mutationFn: (newData: AnamnesisData) => saveAnamnesis(patientId, newData),
        onSuccess: (_, variables) => {
            const savedHash = JSON.stringify(variables)
            lastPersistedHash.current = savedHash
            if (savedHash === currentPayloadHash.current) {
                localStorage.removeItem(draftStorageKey)
                setHasLocalDraft(false)
            }
        },
        onError: () => toast.error("Falha ao salvar anamnese automaticamente."),
    })

    useEffect(() => {
        if (!hydrated) return
        const draft: AnamnesisDraft = { content, updatedAt: Date.now() }
        localStorage.setItem(draftStorageKey, JSON.stringify(draft))

        if (payloadHash !== lastPersistedHash.current) {
            setHasLocalDraft(true)
        }
    }, [content, draftStorageKey, hydrated, payloadHash])

    useEffect(() => {
        if (!hydrated) return
        if (payloadHash === lastPersistedHash.current) return

        const timer = setTimeout(() => mutate(payload), 700)
        return () => clearTimeout(timer)
    }, [hydrated, mutate, payload, payloadHash])

    useEffect(() => {
        return () => {
            if (copiedTimerRef.current) {
                window.clearTimeout(copiedTimerRef.current)
            }
        }
    }, [])

    const handleGeneratePDF = async () => {
        if (!content.trim()) {
            toast.error("Conteúdo vazio.")
            return
        }

        setIsExporting(true)
        try {
            const generatedAt = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
            const blob = await pdf(
                <AnamnesisPDFTemplate patientName={patientName} content={content} generatedAt={generatedAt} />
            ).toBlob()

            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            const safeName = (patientName || patientId).trim().replace(/\s+/g, "-")
            link.download = `Anamnese-${safeName}.pdf`

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            URL.revokeObjectURL(url)
            toast.success("PDF baixado com sucesso!")
        } catch (error) {
            toast.error("Erro ao gerar PDF.")
        } finally {
            setIsExporting(false)
        }
    }

    if (isLoading || !hydrated) return <AnamnesisSkeleton />

    const withTextarea = (callback: (textarea: HTMLTextAreaElement) => void) => {
        const textarea = textareaRef.current
        if (!textarea) return
        callback(textarea)
    }

    const applyInlineFormat = (marker: string) => {
        withTextarea((textarea) => {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const selected = content.slice(start, end)
            const wrapped = `${marker}${selected}${marker}`
            const next = `${content.slice(0, start)}${wrapped}${content.slice(end)}`

            setContent(next)

            requestAnimationFrame(() => {
                textarea.focus()
                const cursor = selected ? end + marker.length * 2 : start + marker.length
                textarea.setSelectionRange(cursor, cursor)
                autoResize(textarea)
            })
        })
    }

    const applyLinePrefix = (prefix: string, numbered = false) => {
        withTextarea((textarea) => {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd

            const lineStart = content.lastIndexOf("\n", start - 1) + 1
            const lineEndCandidate = content.indexOf("\n", end)
            const lineEnd = lineEndCandidate === -1 ? content.length : lineEndCandidate
            const segment = content.slice(lineStart, lineEnd)
            const lines = segment.split("\n")

            const prefixed = lines
                .map((line, index) => (numbered ? `${index + 1}. ${line}` : `${prefix} ${line}`))
                .join("\n")

            const next = `${content.slice(0, lineStart)}${prefixed}${content.slice(lineEnd)}`
            setContent(next)

            requestAnimationFrame(() => {
                textarea.focus()
                textarea.setSelectionRange(lineStart, lineStart + prefixed.length)
                autoResize(textarea)
            })
        })
    }

    const copyContent = async () => {
        try {
            await navigator.clipboard.writeText(content)
            setCopied(true)
            if (copiedTimerRef.current) {
                window.clearTimeout(copiedTimerRef.current)
            }
            copiedTimerRef.current = window.setTimeout(() => {
                setCopied(false)
                copiedTimerRef.current = null
            }, 1800)

            toast.success("Anamnese copiada.")
        } catch {
            toast.error("Nao foi possivel copiar.")
        }
    }

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border bg-card p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Anamnese</h2>
                        <p className="text-muted-foreground text-sm">Editor unico com salvamento automatico e rascunho local.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGeneratePDF}
                            disabled={isExporting || !content.trim()}
                            className="text-white hover:text-white cursor-pointer bg-red-500 hover:bg-red-600"
                        >
                            {isExporting ? (
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                                <FileDown className="mr-1 h-4 w-4" />
                            )}
                            Gerar PDF
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            onClick={copyContent}
                            className={cn(
                                "cursor-pointer transition-all duration-300",
                                copied
                                    ? "bg-emerald-600 text-white hover:bg-emerald-600 animate-in fade-in zoom-in-95"
                                    : "bg-blue-500 hover:bg-blue-600",
                            )}
                        >
                            {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                            {copied ? "Copiado" : "Copiar Anamnese"}
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => applyInlineFormat("**")}>
                            <Bold className="mr-1 h-4 w-4" />
                            Negrito
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => applyInlineFormat("*")}>
                            <Italic className="mr-1 h-4 w-4" />
                            Italico
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => applyInlineFormat("__")}>
                            <Underline className="mr-1 h-4 w-4" />
                            Sublinhado
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => applyInlineFormat("==")}>
                            <Highlighter className="mr-1 h-4 w-4" />
                            Marca-texto
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => applyLinePrefix("-")}>
                            <List className="mr-1 h-4 w-4" />
                            Lista
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => applyLinePrefix("1.", true)}>
                            <ListOrdered className="mr-1 h-4 w-4" />
                            Numerada
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="anamnesis-editor" className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Registro clinico
                    </Label>
                    <Textarea
                        id="anamnesis-editor"
                        ref={(element) => {
                            textareaRef.current = element
                            autoResize(element)
                        }}
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value)
                            autoResize(e.target)
                        }}
                        placeholder={ANAMNESIS_PLACEHOLDER}
                        className="min-h-[260px] resize-none overflow-hidden leading-relaxed"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end px-1">
                <p className="text-xs text-muted-foreground">
                    {isPending ? "Salvando..." : hasLocalDraft ? "Rascunho local nao sincronizado" : "Salvo automaticamente"}
                </p>
            </div>

            <div className="rounded-xl border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
                Dica: use "## Titulo" para separar secoes e facilitar leitura do prontuario.
            </div>
        </div>
    )
}

function AnamnesisSkeleton() {
    return (
        <div className="space-y-4 py-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <div className="space-y-3 rounded-2xl border bg-card p-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-[320px] w-full" />
            </div>
        </div>
    )
}
