"use client"

import { useState, useMemo } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Loader2, FileSearch } from "lucide-react"
import { toast } from "sonner"

import { getPatientAttachments, deleteAttachment } from "@/api/attachments/attachments"
import type { AttachmentPatientItem } from "@/types/attachment"
import { FileUploadZone } from "./file-upload-zone"
import { FileTypeFilter, getFileType } from "./file-type-filter"
import type { FileTypeFilter as FileTypeFilterEnum } from "./file-type-filter"
import { FileCard } from "./file-card"
import { SimplePreviewModal } from "./simple-preview-modal"

const EMPTY_LABEL: Record<FileTypeFilterEnum, string> = {
    all: "Nenhum arquivo encontrado.",
    pdf: "Nenhum PDF encontrado.",
    image: "Nenhuma imagem encontrada.",
    audio: "Nenhum áudio encontrado.",
}

export function PatientFilesTab({ patientId }: { patientId: string }) {
    const queryClient = useQueryClient()
    const [typeFilter, setTypeFilter] = useState<FileTypeFilterEnum>("all")
    const [previewFile, setPreviewFile] = useState<AttachmentPatientItem | null>(null)

    const { data: attachments = [], isLoading } = useQuery({
        queryKey: ["patient-attachments", patientId],
        queryFn: () => getPatientAttachments(patientId),
        enabled: !!patientId,
    })

    const sorted = useMemo(
        () => [...attachments].sort(
            (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
        ),
        [attachments],
    )

    const counts = useMemo<Record<FileTypeFilterEnum, number>>(
        () => ({
            all: sorted.length,
            pdf: sorted.filter((f) => getFileType(f.type) === "pdf").length,
            image: sorted.filter((f) => getFileType(f.type) === "image").length,
            audio: sorted.filter((f) => getFileType(f.type) === "audio").length,
        }),
        [sorted],
    )

    const filtered = useMemo(
        () =>
            typeFilter === "all"
                ? sorted
                : sorted.filter((f) => getFileType(f.type) === typeFilter),
        [sorted, typeFilter],
    )

    const { mutate: removeFile } = useMutation({
        mutationFn: deleteAttachment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patient-attachments", patientId] })
            toast.success("Arquivo removido.")
        },
        onError: () => toast.error("Erro ao remover arquivo."),
    })

    function handleUploadSuccess() {
        queryClient.invalidateQueries({ queryKey: ["patient-attachments", patientId] })
    }

    return (
        <div className="space-y-4 mt-4">
            <FileUploadZone patientId={patientId} onSuccess={handleUploadSuccess} />

            <FileTypeFilter
                filter={typeFilter}
                counts={counts}
                onFilterChange={setTypeFilter}
            />

            {isLoading ? (
                <div className="flex flex-col items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500/40" />
                    <p className="text-xs text-muted-foreground mt-2">Sincronizando arquivos...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 border-2 border-dashed border-border/40 rounded-2xl bg-muted/10 text-muted-foreground">
                    <FileSearch className="h-10 w-10 mb-2 opacity-30" />
                    <p className="text-sm font-medium">{EMPTY_LABEL[typeFilter]}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filtered.map((file) => (
                        <FileCard
                            key={file.id}
                            file={file}
                            onPreview={setPreviewFile}
                            onDelete={removeFile}
                        />
                    ))}
                </div>
            )}

            <SimplePreviewModal
                file={previewFile}
                onClose={() => setPreviewFile(null)}
            />
        </div>
    )
}
