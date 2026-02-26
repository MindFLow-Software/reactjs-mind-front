"use client"

import { useState } from "react"
import { format, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Download, FileText, ArrowLeft, Loader2 } from "lucide-react"
import { pdf } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { SessionPDFTemplate } from "@/utils/session-pdf-template"

interface EvolutionViewerProps {
    patientName: string
    content: string
    date: string
    diagnosis?: string
    psychologist: { name: string; crp: string }
    onBack: () => void
}

export function EvolutionViewer({
    patientName,
    content,
    date,
    diagnosis,
    psychologist,
    onBack,
}: EvolutionViewerProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const parsedDate = new Date(date)
    const isDateValid = isValid(parsedDate)

    const handleExportPDF = async () => {
        try {
            setIsGenerating(true)

            const blob = await pdf(
                <SessionPDFTemplate
                    psychologist={psychologist}
                    patientName={patientName}
                    date={isDateValid ? format(parsedDate, "dd/MM/yyyy") : "--/--/----"}
                    content={content || "Nenhuma evolucao registrada."}
                    diagnosis={diagnosis || "Nao informado"}
                />
            ).toBlob()

            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url

            const dateSuffix = isDateValid ? format(parsedDate, "dd-MM-yyyy") : "data-indisponivel"
            link.download = `Evolucao-${patientName.replace(/\s+/g, "-")}-${dateSuffix}.pdf`

            link.click()

            URL.revokeObjectURL(url)
            toast.success("PDF gerado com sucesso!")
        } catch (error) {
            console.error("Erro ao gerar PDF:", error)
            toast.error("Erro ao gerar o arquivo PDF.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="w-full min-w-0 max-w-full mx-auto space-y-6 py-2 overflow-x-hidden">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="cursor-pointer h-8 px-2 -ml-2 text-muted-foreground hover:text-slate-900 gap-1.5 transition-colors"
                >
                    <ArrowLeft size={14} />
                    <span className="text-xs font-medium">Voltar ao historico</span>
                </Button>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 text-slate-900">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <h2 className="text-xl font-semibold tracking-tight">Evolucao Psicologica</h2>
                </div>

                <div className="flex items-center justify-between gap-3 mt-3 text-sm min-w-0">
                    <p className="text-muted-foreground min-w-0">
                        Paciente: <span className="font-medium text-slate-700 [overflow-wrap:anywhere]">{patientName}</span>
                    </p>
                    <p className="text-muted-foreground tabular-nums shrink-0">
                        {isDateValid
                            ? format(parsedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
                            : "Data nao disponivel"}
                    </p>
                </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="min-h-[180px] max-w-full rounded-lg bg-muted/20 px-3 py-4 sm:px-4 overflow-x-hidden">
                <p className="whitespace-pre-wrap [overflow-wrap:anywhere] font-serif text-lg leading-relaxed text-slate-700">
                    {content || "Nenhuma anotacao registrada para esta sessao."}
                </p>
            </div>

            <Separator className="bg-slate-100" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                <p className="text-[11px] leading-relaxed text-slate-400 italic max-w-sm">
                    Este documento e sigiloso e de uso restrito, gerado a partir de registro eletronico de prontuario.
                </p>

                <Button
                    onClick={handleExportPDF}
                    disabled={isGenerating}
                    className="cursor-pointer w-full sm:w-auto gap-2 bg-slate-900 hover:bg-slate-800 text-white transition-all px-8 h-10 shadow-sm"
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    {isGenerating ? "Gerando..." : "Gerar PDF Oficial"}
                </Button>
            </div>
        </div>
    )
}
