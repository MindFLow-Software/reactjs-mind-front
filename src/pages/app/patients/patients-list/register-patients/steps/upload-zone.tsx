import "./upload-zone.css"
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
                className={cn("rp-upload-zone", isDrag ? "rp-upload-zone--drag" : "rp-upload-zone--idle")}
                onDragEnter={(e) => { e.preventDefault(); setIsDrag(true) }}
                onDragOver={(e)  => { e.preventDefault(); setIsDrag(true) }}
                onDragLeave={(e) => { e.preventDefault(); setIsDrag(false) }}
                onDrop={handleDrop}
                onClick={triggerInput}
            >
                <div className="rp-upload-zone__icon-box">
                    <CloudUpload className="size-6" />
                </div>
                <div>
                    <p className="rp-upload-zone__title">Arraste arquivos ou clique para anexar</p>
                    <p className="rp-upload-zone__desc">
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
                <div className="rp-upload-file-list">
                    {selectedFiles.map((file, i) => (
                        <div key={`${file.name}-${i}`} className="rp-upload-file-item">
                            <FileText className="size-4 shrink-0 text-blue-600" />
                            <span className="rp-upload-file-name">{file.name}</span>
                            <span className="rp-upload-file-size">{formatFileSize(file.size)}</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onFilesChange(selectedFiles.filter((_, j) => j !== i))
                                }}
                                className="rp-upload-file-remove"
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
