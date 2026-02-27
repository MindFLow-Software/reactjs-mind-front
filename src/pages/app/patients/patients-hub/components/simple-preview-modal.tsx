"use client"

import {
    FileText,
    ExternalLink,
    Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"

interface SimplePreviewModalProps {
    file: any | null
    onClose: () => void
}

export function SimplePreviewModal({ file, onClose }: SimplePreviewModalProps) {
    if (!file) return null

    // Configuração do Backend - Sincronizado com sua porta atual
    const backendUrl = "http://localhost:8080"
    const rawUrl = file?.fileUrl || ""

    // Normalização da URL: garante que aponte para o backend se for um caminho relativo
    const fileUrl = rawUrl.startsWith('http')
        ? rawUrl
        : `${backendUrl}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`

    const isImage = file?.contentType?.toLowerCase().includes("image") || /\.(jpg|jpeg|png|webp|gif)$/i.test(file?.filename || "")
    const isPDF = file?.contentType?.toLowerCase().includes("pdf") || file?.filename?.toLowerCase().endsWith(".pdf")

    return (
        <Dialog open={!!file} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col overflow-hidden bg-background">
                <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 shrink-0">
                    <div className="flex flex-col gap-0.5 pr-10">
                        <DialogTitle className="text-sm font-bold truncate">
                            {file?.filename || "Visualização de Arquivo"}
                        </DialogTitle>
                        <DialogDescription className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            Visualizador de Documentos Clínicos
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {!rawUrl ? (
                        <div className="text-center">
                            <Loader2 className="size-6 animate-spin mb-2 text-blue-500 mx-auto" />
                            <p className="text-xs text-muted-foreground">Carregando endereço do arquivo...</p>
                        </div>
                    ) : isImage ? (
                        <img
                            src={fileUrl}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain p-4 drop-shadow-md"
                        />
                    ) : isPDF ? (
                        <iframe
                            src={`${fileUrl}#toolbar=0&navpanes=0`}
                            className="w-full h-full border-none bg-white shadow-inner"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="text-center p-8 bg-white rounded-2xl border shadow-sm">
                            <FileText className="size-12 mx-auto mb-4 text-muted-foreground/20" />
                            <p className="text-sm font-medium">Visualização direta indisponível.</p>
                            <Button className="mt-4 gap-2" asChild>
                                <a href={fileUrl} target="_blank" rel="noreferrer">
                                    <ExternalLink className="size-4" />
                                    Abrir em nova aba
                                </a>
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}