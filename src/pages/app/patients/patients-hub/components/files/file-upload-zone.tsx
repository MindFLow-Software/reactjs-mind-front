"use client"

import { useRef, useState } from "react"
import { CloudUpload, Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { uploadAttachment } from "@/api/attachments/attachments"
import { uploadFileSchema, ACCEPTED_MIME_TYPES } from "@/validators/attachments"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
    patientId: string
    onSuccess: () => void
}

export function FileUploadZone({ patientId, onSuccess }: FileUploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const { mutateAsync: upload, isPending } = useMutation({
        mutationFn: (file: File) => uploadAttachment(file, patientId),
        onSuccess: () => {
            toast.success("Arquivo enviado!")
            onSuccess()
        },
        onError: () => toast.error("Erro ao enviar arquivo."),
    })

    async function handleFile(file: File) {
        const result = uploadFileSchema.safeParse(file)
        if (!result.success) {
            toast.error(result.error.issues[0]?.message ?? "Arquivo inválido.")
            return
        }
        await upload(file)
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
        e.target.value = ""
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <label
                className={cn(
                    "flex cursor-pointer flex-col items-center gap-3 rounded-[10px] border-2 border-dashed p-[22px] text-center transition-all duration-150",
                    isDragging
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40"
                        : "border-border bg-muted/50 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30",
                    isPending && "pointer-events-none opacity-60",
                )}
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    const files = e.dataTransfer.files
                    if (!files.length) return
                    if (files.length > 1) toast.info("Envie um arquivo por vez.")
                    handleFile(files[0])
                }}
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!isPending) inputRef.current?.click()
                }}
            >
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-blue-100 bg-card text-blue-600 dark:border-blue-900">
                    {isPending ? (
                        <Loader2 className="size-5 animate-spin" />
                    ) : (
                        <CloudUpload className="size-6" />
                    )}
                </div>

                <div>
                    <p className="text-[13.5px] font-semibold text-foreground">
                        {isPending ? "Enviando arquivo..." : "Arraste arquivos ou clique para anexar"}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                        PDFs, imagens ou áudios · até 5 MB cada · vinculados a este paciente
                    </p>
                </div>
            </label>

            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_MIME_TYPES.join(",")}
                onChange={onInputChange}
                className="hidden"
            />
        </div>
    )
}
