"use client"

import { useMemo } from "react"
import { FileText, ArrowDownToLine, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { handleFileDownload } from "@/utils/handle-file-download"
import type { AttachmentPatientItem } from "@/types/attachment"

const BACKEND_FALLBACK_URL = "http://localhost:8080"
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)$/i

interface SimplePreviewModalProps {
    file: AttachmentPatientItem | null
    onClose: () => void
}

const buildAttachmentUrl = (id: string) =>
    `${import.meta.env.VITE_API_URL?.trim() ?? BACKEND_FALLBACK_URL}/attachments/${id}`

const isImageMime = (mime: string, name: string) =>
    mime.includes("image") || IMAGE_EXTENSIONS.test(name)

const isPdfMime = (mime: string, name: string) =>
    mime.includes("pdf") || name.endsWith(".pdf")

export function SimplePreviewModal({ file, onClose }: SimplePreviewModalProps) {
    if (!file) return null

    const { id } = file
    const fileUrl = useMemo(() => buildAttachmentUrl(id), [id])
    const fileName = file.filename
    const fileMime = file.type.toLowerCase()
    const lowerFileName = fileName.toLowerCase()
    const isImage = isImageMime(fileMime, lowerFileName)
    const isPDF = !isImage && isPdfMime(fileMime, lowerFileName)
    const downloadLabel = isImage ? "Imagem" : isPDF ? "PDF" : "Arquivo"

    return (
        <Dialog open={Boolean(file)} onOpenChange={onClose}>
            <DialogContent
                showCloseButton={false}
                className="max-w-4xl h-[88vh] p-0 flex flex-col overflow-hidden rounded-2xl shadow-2xl border-0 gap-0"
            >
                <div className="flex items-center gap-3 px-5 py-4 bg-[#0d1117] shrink-0">
                    <div className="flex-1 min-w-0">
                        <DialogTitle
                            className="text-sm font-semibold text-white truncate leading-tight"
                            title={fileName}
                        >
                            {fileName}
                        </DialogTitle>
                        <DialogDescription className="text-[10px] text-blue-400/70 uppercase tracking-[0.12em] mt-0.5 font-medium">
                            MindFlush · Visualizador de Alta Precisão
                        </DialogDescription>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/60 hover:text-white hover:border-white/50 transition-colors cursor-pointer"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="h-[3px] bg-blue-600 shrink-0" />

                <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-muted/40">
                    <div className="absolute inset-0 flex items-center justify-center z-0">
                        <Loader2 className="size-7 animate-spin text-muted-foreground/20" />
                    </div>

                    {isImage ? (
                        <img
                            src={fileUrl}
                            alt={fileName}
                            className="relative z-10 w-full h-full object-contain p-4"
                            loading="lazy"
                            onError={(e) => { e.currentTarget.style.display = "none" }}
                        />
                    ) : isPDF ? (
                        <iframe
                            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="relative z-10 w-full h-full border-none"
                            title="Visualização de PDF"
                        />
                    ) : (
                        <div className="relative z-10 flex flex-col items-center justify-center gap-3 py-20 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                <FileText className="size-7 text-muted-foreground/40" />
                            </div>
                            <p className="text-sm font-medium text-foreground">Formato não suportado</p>
                            <p className="text-xs text-muted-foreground max-w-[240px]">
                                Não é possível visualizar este tipo de arquivo. Faça o download para abri-lo.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between px-5 py-3 bg-[#0d1117] shrink-0 gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-white/40 hover:text-white hover:bg-white/10 text-[11px] tracking-[0.1em] uppercase font-semibold"
                        onClick={onClose}
                    >
                        Fechar
                    </Button>
                    <Button
                        size="sm"
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white gap-2 h-8 px-5"
                        onClick={() => handleFileDownload(id, fileName)}
                    >
                        <ArrowDownToLine className="size-3.5" />
                        Baixar {downloadLabel}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
