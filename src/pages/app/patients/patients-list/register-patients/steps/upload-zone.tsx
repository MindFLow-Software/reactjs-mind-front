import "./upload-zone.css"
import { useRef, useState, memo, useCallback } from "react"
import type { DragEvent } from "react"
import { CloudUpload, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatFileSize } from "@/utils/format-file-size"
import { MAX_DOC_FILES } from "../constants"

interface UploadZoneProps {
    selectedFiles: File[]
    onFilesChange: (incoming: File[]) => void
    onRemoveFile:  (index: number) => void
}

export const UploadZone = memo(({ selectedFiles, onFilesChange, onRemoveFile }: UploadZoneProps) => {
    const inputRef            = useRef<HTMLInputElement>(null)
    const [isDrag, setIsDrag] = useState(false)

    const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) onFilesChange(Array.from(e.target.files))
        e.target.value = ""
    }, [onFilesChange])

    function handleDrop(e: DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsDrag(false)
        onFilesChange(Array.from(e.dataTransfer.files))
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
                                    onRemoveFile(i)
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
