import { Button } from "@/components/ui/button"
import { FileDown, Check, Copy, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnamnesisHeaderProps {
    onGeneratePDF: () => void
    onCopy: () => void
    isExporting: boolean
    isCopyDisabled: boolean
    copied: boolean
    pdfSuccess: boolean // <-- Novo prop aqui
}

export function AnamnesisHeader({
    onGeneratePDF,
    onCopy,
    isExporting,
    isCopyDisabled,
    copied,
    pdfSuccess // Recebe o novo estado
}: AnamnesisHeaderProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight">Anamnese</h2>
                <p className="text-muted-foreground text-sm">Blocos editáveis com salvamento automático e rascunho local.</p>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    size="sm"
                    onClick={onGeneratePDF}
                    disabled={isExporting || isCopyDisabled}
                    className={cn(
                        "text-white transition-all duration-300 min-w-[110px] cursor-pointer",
                        pdfSuccess
                            ? "bg-emerald-600 hover:bg-emerald-600"
                            : isExporting
                                ? "bg-red-400"
                                : "bg-red-500 hover:bg-red-600"
                    )}
                >
                    {isExporting ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : pdfSuccess ? (
                        <Check className="mr-1 h-4 w-4" />
                    ) : (
                        <FileDown className="mr-1 h-4 w-4" />
                    )}

                    {isExporting ? "Gerando..." : pdfSuccess ? "Baixado" : "Gerar PDF"}
                </Button>

                <Button
                    type="button"
                    size="sm"
                    onClick={onCopy}
                    className={cn(
                        "transition-all duration-300 min-w-[130px] cursor-pointer",
                        copied
                            ? "bg-emerald-600 text-white hover:bg-emerald-600"
                            : "bg-blue-500 hover:bg-blue-600 text-white",
                    )}
                >
                    {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                    {copied ? "Copiado" : "Copiar Anamnese"}
                </Button>
            </div>
        </div>
    )
}