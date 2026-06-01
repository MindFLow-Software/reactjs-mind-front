import { useState, useCallback } from "react"
import { toast } from "sonner"

interface UseFileSelectionOptions {
    maxFiles:     number
    maxSizeBytes: number
}

interface UseFileSelectionReturn {
    files:      File[]
    addFiles:   (incoming: File[]) => void
    removeFile: (index: number) => void
    clearFiles: () => void
}

export function useFileSelection({ maxFiles, maxSizeBytes }: UseFileSelectionOptions): UseFileSelectionReturn {
    const [files, setFiles] = useState<File[]>([])

    const addFiles = useCallback((incoming: File[]) => {
        if (incoming.length === 0) return

        setFiles((prev) => {
            const valid: File[] = []

            for (const file of incoming) {
                if (file.size > maxSizeBytes) {
                    toast.error(`O arquivo "${file.name}" é muito grande.`, {
                        description: `O limite por arquivo é de ${Math.round(maxSizeBytes / (1024 * 1024))} MB.`,
                    })
                    continue
                }
                const isDuplicate =
                    prev.some((x) => x.name === file.name && x.size === file.size) ||
                    valid.some((x) => x.name === file.name && x.size === file.size)
                if (isDuplicate) continue
                valid.push(file)
            }

            const available = maxFiles - prev.length
            if (valid.length > available) {
                toast.error("Limite de arquivos excedido", {
                    description: `Você pode ter no máximo ${maxFiles} arquivos selecionados.`,
                })
                return [...prev, ...valid.slice(0, available)]
            }

            return valid.length > 0 ? [...prev, ...valid] : prev
        })
    }, [maxFiles, maxSizeBytes])

    const removeFile = useCallback((index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }, [])

    const clearFiles = useCallback(() => {
        setFiles([])
    }, [])

    return { files, addFiles, removeFile, clearFiles }
}
