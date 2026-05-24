"use client"

import { useRef, useState, useCallback } from "react"
import { CloudUpload, X, Trash2, CheckCircle2, AlertCircle, Loader2, Lock, Users, User } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { uploadAttachment } from "@/api/attachments/attachments"
import { getPatientsWithAttachments } from "@/api/patients/patient-with-attachment"

interface UploadModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

type FileStatus = "pending" | "uploading" | "done" | "error"

interface FileItem {
    id: string
    file: File
    status: FileStatus
    progress: number
    error?: string
}

function formatBytes(bytes: number): string {
    if (bytes <= 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getFileMimeGroup(type: string): string {
    if (type.includes("pdf")) return "PDF"
    if (type.includes("image")) return "IMG"
    if (type.includes("word") || type.includes("document")) return "DOC"
    if (type.includes("excel") || type.includes("spreadsheet")) return "XLS"
    return "FILE"
}

const MIME_GRADIENT: Record<string, string> = {
    PDF:  "from-red-600 to-red-800",
    IMG:  "from-cyan-500 to-cyan-700",
    DOC:  "from-blue-500 to-blue-800",
    XLS:  "from-green-600 to-green-800",
    FILE: "from-slate-500 to-slate-700",
}

function FileThumb({ type }: { type: string }) {
    const group = getFileMimeGroup(type)
    return (
        <div className={cn(
            "flex h-10 w-8 shrink-0 items-end justify-center rounded-md bg-gradient-to-br overflow-hidden",
            MIME_GRADIENT[group],
        )}>
            <span className="mb-0.5 text-[7px] font-bold text-white/80">{group}</span>
        </div>
    )
}

export function UploadModal({ open, onClose, onSuccess }: UploadModalProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [files, setFiles] = useState<FileItem[]>([])
    const [patientId, setPatientId] = useState<string>("")
    const dragCounter = useRef(0)

    const { data: patients, isLoading: patientsLoading } = useQuery({
        queryKey: ["patients-with-attachments"],
        queryFn: getPatientsWithAttachments,
        staleTime: 1000 * 60 * 5,
        enabled: open,
    })

    const addFiles = useCallback((incoming: FileList | File[]) => {
        const newItems: FileItem[] = Array.from(incoming).map((file) => ({
            id:       crypto.randomUUID(),
            file,
            status:   "pending",
            progress: 0,
        }))
        setFiles((prev) => [...prev, ...newItems])
    }, [])

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id))
    }

    const updateFile = (id: string, patch: Partial<FileItem>) => {
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, ...patch } : f))
    }

    const handleClose = () => {
        if (files.some((f) => f.status === "uploading")) return
        setFiles([])
        setPatientId("")
        onClose()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        dragCounter.current = 0
        setIsDragging(false)
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        dragCounter.current++
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        dragCounter.current--
        if (dragCounter.current === 0) setIsDragging(false)
    }

    const handleUpload = async () => {
        if (!patientId) {
            toast.error("Selecione um paciente antes de enviar.")
            return
        }
        const pending = files.filter((f) => f.status === "pending" || f.status === "error")
        if (!pending.length) return

        // Upload up to 3 in parallel
        const chunks: FileItem[][] = []
        for (let i = 0; i < pending.length; i += 3) chunks.push(pending.slice(i, i + 3))

        for (const chunk of chunks) {
            await Promise.all(
                chunk.map(async (item) => {
                    updateFile(item.id, { status: "uploading", progress: 10, error: undefined })
                    try {
                        await uploadAttachment(item.file, patientId)
                        updateFile(item.id, { status: "done", progress: 100 })
                    } catch {
                        updateFile(item.id, { status: "error", progress: 0, error: "Falha no envio" })
                    }
                }),
            )
        }

        const allDone = files.every((f) => f.status === "done" || !pending.includes(f))
        const doneCount = files.filter((f) => f.status === "done").length
        if (doneCount > 0) {
            toast.success(`${doneCount} ${doneCount === 1 ? "documento enviado" : "documentos enviados"} com sucesso.`)
            onSuccess()
        }

        const hasErrors = files.some((f) => f.status === "error")
        if (!hasErrors && allDone) setTimeout(handleClose, 800)
    }

    const pendingCount = files.filter((f) => f.status === "pending" || f.status === "error").length
    const isUploading = files.some((f) => f.status === "uploading")
    const canUpload = pendingCount > 0 && !isUploading

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
            <DialogContent className="max-w-[600px] p-0 gap-0 overflow-hidden rounded-2xl">
                {/* Head */}
                <div className="flex items-start gap-3 px-6 py-5 border-b border-border">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                        <CloudUpload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <DialogTitle className="text-[15px] font-bold text-foreground">
                            Enviar documento
                        </DialogTitle>
                        <DialogDescription className="text-[13px] text-muted-foreground mt-0.5">
                            Adicione anexos clínicos vinculados a um paciente.
                        </DialogDescription>
                    </div>
                    <button
                        onClick={handleClose}
                        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        aria-label="Fechar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* Drop zone */}
                    <div
                        onDragEnter={handleDragEnter}
                        onDragOver={(e) => e.preventDefault()}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-150",
                            isDragging
                                ? "border-primary bg-blue-50 dark:bg-blue-950/20"
                                : "border-border bg-muted/40 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10",
                        )}
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-100 bg-card dark:border-blue-900">
                            <CloudUpload className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[13.5px] font-semibold text-foreground">
                                {isDragging ? "Solte para enviar" : "Arraste arquivos aqui ou clique para selecionar"}
                            </p>
                            <p className="mt-1 text-[12px] text-muted-foreground">
                                PDF, JPG, PNG, DOCX — até 20 MB cada
                            </p>
                        </div>
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = "" }}
                    />

                    {/* File list */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    {files.length} {files.length === 1 ? "arquivo" : "arquivos"}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setFiles([])}
                                    className="text-[12px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                >
                                    Limpar tudo
                                </button>
                            </div>

                            {files.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                                >
                                    <FileThumb type={item.file.type} />

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className="text-[13px] font-semibold text-foreground truncate">
                                            {item.file.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[11px] text-muted-foreground">
                                                {formatBytes(item.file.size)}
                                            </p>
                                            {item.status === "error" && (
                                                <p className="text-[11px] text-destructive font-medium">
                                                    {item.error}
                                                </p>
                                            )}
                                        </div>

                                        {item.status === "uploading" && (
                                            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-primary transition-all duration-300"
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>
                                        )}
                                        {item.status === "done" && (
                                            <div className="h-1 w-full rounded-full bg-green-500/30">
                                                <div className="h-full w-full rounded-full bg-green-500" />
                                            </div>
                                        )}
                                        {item.status === "error" && (
                                            <div className="h-1 w-full rounded-full bg-destructive/30">
                                                <div className="h-full w-full rounded-full bg-destructive" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="shrink-0">
                                        {item.status === "uploading" && (
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        )}
                                        {item.status === "done" && (
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        )}
                                        {item.status === "error" && (
                                            <AlertCircle className="h-4 w-4 text-destructive" />
                                        )}
                                        {item.status === "pending" && (
                                            <button
                                                type="button"
                                                onClick={() => removeFile(item.id)}
                                                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Patient selector */}
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-foreground">
                            Paciente <span className="text-destructive">*</span>
                        </label>
                        <Select value={patientId} onValueChange={setPatientId}>
                            <SelectTrigger className={cn(
                                "h-9 cursor-pointer bg-background border-muted-foreground/20 hover:border-primary/40 transition-all",
                                !patientId && "text-muted-foreground",
                            )}>
                                <div className="flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    <SelectValue placeholder={patientsLoading ? "Carregando..." : "Selecionar paciente"} />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="max-h-[220px]">
                                {patients?.map((p) => (
                                    <SelectItem key={p.id} value={p.id} className="cursor-pointer py-2.5">
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                            <span className="text-sm font-medium">{p.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-muted/20 shrink-0">
                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        Criptografado em trânsito
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleClose} className="cursor-pointer h-9">
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            className="cursor-pointer h-9 gap-2 min-w-[120px]"
                            onClick={handleUpload}
                            disabled={!canUpload || !patientId}
                        >
                            {isUploading ? (
                                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Enviando...</>
                            ) : (
                                <><CloudUpload className="h-3.5 w-3.5" /> Enviar {pendingCount > 0 ? `(${pendingCount})` : ""}</>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
