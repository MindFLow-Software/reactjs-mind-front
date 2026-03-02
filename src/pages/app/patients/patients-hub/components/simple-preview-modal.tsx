"use client"

import {
    FileText,
    ArrowDownToLine,
    Loader2,
    ImageIcon,
    X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { handleFileDownload } from "@/utils/handle-file-download"

interface SimplePreviewModalProps {
    file: any | null
    onClose: () => void
}

export function SimplePreviewModal({ file, onClose }: SimplePreviewModalProps) {
    if (!file) return null

    const backendUrl = "http://localhost:8080"
    const fileUrl = `${backendUrl}/attachments/${file.id}`

    const fileMime = file.contentType ?? file.fileType ?? ""
    const fileName = file.filename ?? file.fileName ?? "Arquivo"

    const isImage = fileMime.toLowerCase().includes("image") || /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName)
    const isPDF = fileMime.toLowerCase().includes("pdf") || fileName.toLowerCase().endsWith(".pdf")

    const formatLabel = fileMime ? fileMime.split('/')[1].toUpperCase() : isPDF ? 'PDF' : 'IMG'

    return (
        <Dialog open={!!file} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl h-[92vh] p-0 flex flex-col overflow-hidden bg-slate-950 border-none shadow-2xl">

                {/* 1. CABEÇALHO */}
                <DialogHeader className="p-4 border-b border-white/5 bg-slate-900 flex flex-row items-center justify-between shrink-0 space-y-0">
                    <div className="flex flex-col gap-0.5">
                        <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
                            <span className="p-1 bg-blue-600 rounded text-white">
                                {isImage ? <ImageIcon className="size-3" /> : <FileText className="size-3" />}
                            </span>
                            {fileName}
                        </DialogTitle>
                        <DialogDescription className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                            MindFlush • Visualizador de Alta Precisão
                        </DialogDescription>
                    </div>
                    <div className="flex items-center gap-2 pr-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer size-8 rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                            onClick={onClose}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                        <Loader2 className="size-8 animate-spin text-blue-600/20 mb-2" />
                    </div>

                    {isImage ? (
                        <img
                            src={fileUrl}
                            alt="Documento"
                            className="relative z-10 w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    ) : isPDF ? (
                        <iframe
                            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="relative z-10 w-full h-full border-none bg-white"
                            title="PDF"
                        />
                    ) : (
                        <div className="relative z-10 py-20 text-center flex flex-col items-center justify-center">
                            <FileText className="size-16 mb-4 text-slate-700" />
                            <p className="text-sm text-slate-400 font-medium">Formato não visualizável</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-3 bg-slate-900 border-t border-white/5 flex items-center justify-between sm:justify-between shrink-0">
                    <div className="hidden sm:flex items-center gap-3 pl-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase font-black leading-none">Formato</span>
                            <span className="text-xs text-slate-300 font-mono uppercase">
                                {formatLabel}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer text-slate-400 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-tighter"
                            onClick={onClose}
                        >
                            Fechar
                        </Button>
                        <Button
                            className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white gap-2 shadow-xl shadow-blue-900/20 h-9 px-8 rounded-full transition-all active:scale-[0.98] font-bold text-xs uppercase tracking-wider"
                            onClick={() => handleFileDownload(file.id, fileName)}
                        >
                            <ArrowDownToLine className="size-4" />
                            Baixar {isImage ? "Imagem" : isPDF ? "PDF" : "Arquivo"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}