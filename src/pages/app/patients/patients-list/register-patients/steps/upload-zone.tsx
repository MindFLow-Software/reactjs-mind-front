"use client"

import { useRef, useState, memo, useCallback } from "react"
import type { DragEvent } from "react"
import { CloudUpload, FileText, X, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { formatFileSize } from "@/utils/format-file-size"
import { MAX_DOC_FILES, MAX_DOC_SIZE } from "../constants"

interface UploadZoneProps {
    selectedFiles: File[]
    onFilesChange: (files: File[]) => void
}

export const UploadZone = memo(({ selectedFiles, onFilesChange }: UploadZoneProps) => {
    const inputRef            = useRef<HTMLInputElement>(null)
    const [isDrag, setIsDrag] = useState(false)

    const addFiles = useCallback((incoming: File[]) => {
        const oversized = incoming.filter((f) => f.size > MAX_DOC_SIZE)
        oversized.forEach((f) => {
            toast.error(`O arquivo "${f.name}" é muito grande.`, {
                description: "O limite por arquivo é de 3MB."
            })
        })

        const valid = incoming.filter((f) => {
            if (f.size > MAX_DOC_SIZE) return false
            if (selectedFiles.some((x) => x.name === f.name && x.size === f.size)) return false
            return true
        })

        if (selectedFiles.length + valid.length > MAX_DOC_FILES) {
            toast.error("Limite de arquivos excedido", {
                description: `Você pode ter no máximo ${MAX_DOC_FILES} arquivos selecionados.`,
                icon: <AlertCircle className="size-4 text-red-500" />
            })
            return
        }

        if (valid.length > 0) {
            onFilesChange([...selectedFiles, ...valid])
            toast.success(`${valid.length} arquivo(s) adicionado(s).`)
        }
    }, [selectedFiles, onFilesChange])

    const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(Array.from(e.target.files))
        e.target.value = ""
    }, [addFiles])

    function handleDrop(e: DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsDrag(false)
        addFiles(Array.from(e.dataTransfer.files))
    }

    const triggerInput = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        inputRef.current?.click()
    }, [])

    return (
        <div className="space-y-[10px]" onClick={(e) => e.stopPropagation()}>
            <label
                className={cn(
                    "flex cursor-pointer flex-col items-center gap-3 rounded-[10px] border-2 border-dashed p-[22px] text-center transition-all duration-[150ms]",
                    isDrag ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40" : "border-border bg-muted/50 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                )}
                onDragEnter={(e) => { e.preventDefault(); setIsDrag(true) }}
                onDragOver={(e)  => { e.preventDefault(); setIsDrag(true) }}
                onDragLeave={(e) => { e.preventDefault(); setIsDrag(false) }}
                onDrop={handleDrop}
                onClick={triggerInput}
            >
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-blue-100 bg-card text-blue-600 dark:border-blue-900">
                    <CloudUpload className="size-6" />
                </div>
                <div>
                    <p className="text-[13.5px] font-semibold text-foreground">Arraste arquivos ou clique para anexar</p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                        PDFs ou imagens · máximo {MAX_DOC_FILES} arquivos · até 3 MB cada
                    </p>
                </div>
            </label>

            <input
                ref={inputRef}
                type="file"
                multiple
                accept=".pdf,image/*"
                className="hidden"
                onChange={handleInput}
            />

            {selectedFiles.length > 0 && (
                <div className="flex flex-col gap-[6px]">
                    {selectedFiles.map((file, i) => (
                        <div
                            key={`${file.name}-${i}`}
                            className="flex items-center gap-2 rounded-[6px] border border-border bg-card px-[10px] py-[7px]"
                        >
                            <FileText className="size-4 shrink-0 text-blue-600" />
                            <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-foreground">{file.name}</span>
                            <span className="shrink-0 tabular-nums text-[11px] text-muted-foreground">{formatFileSize(file.size)}</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onFilesChange(selectedFiles.filter((_, j) => j !== i))
                                }}
                                className="flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                            >
                                <X className="size-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
})

UploadZone.displayName = "UploadZone"
