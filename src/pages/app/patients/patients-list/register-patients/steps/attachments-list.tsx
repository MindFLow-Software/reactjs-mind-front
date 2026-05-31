"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Eye, Download, FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getPatientAttachments, deleteAttachment } from "@/api/attachments/attachments"
import { handleFileDownload } from "@/utils/handle-file-download"
import { formatFileSize } from "@/utils/format-file-size"
import { getFileKind, FILE_KIND_STYLES } from "@/utils/file-helpers"
import { cn } from "@/lib/utils"
import { DeleteActionButton } from "./delete-attachments-button"

interface AttachmentsListProps {
    patientId: string
}

export function AttachmentsList({ patientId }: AttachmentsListProps) {
    const queryClient = useQueryClient()

    const { data: attachments, isLoading } = useQuery({
        queryKey: ["attachments", patientId],
        queryFn: () => getPatientAttachments(patientId),
        staleTime: 1000 * 60 * 5,
    })

    const { mutateAsync: removeFn, isPending: isRemoving } = useMutation({
        mutationFn: deleteAttachment,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["attachments", patientId],
            })
            toast.success("Documento removido.")
        },
        onError: () => {
            toast.error("Erro ao excluir o arquivo.")
        }
    })

    return (
        <div>
            <div className="mb-[10px] flex items-center gap-[7px]">
                <FileText className="size-[13px] shrink-0 text-blue-600" />
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                    Documentos enviados
                </span>
                {attachments && attachments.length > 0 && (
                    <span className="ml-0.5 rounded-[10px] bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {attachments.length}
                    </span>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-blue-500/50" />
                </div>
            ) : !attachments || attachments.length === 0 ? (
                <p className="rounded-[8px] border border-dashed border-border py-6 text-center text-[12px] text-muted-foreground">
                    Nenhum documento enviado ainda.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    {attachments.map((file) => {
                        const kind       = getFileKind(file.type ?? "")
                        const fileStyle  = FILE_KIND_STYLES[kind]
                        const uploadDate = new Date(file.uploadedAt).toLocaleDateString("pt-BR", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                        })

                        return (
                            <div
                                key={file.id}
                                className="flex items-start gap-2.5 rounded-[8px] border border-border bg-card p-[10px] transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
                            >
                                <div
                                    className={cn(
                                        "relative flex shrink-0 items-center justify-center rounded-[4px] bg-gradient-to-br text-[9px] font-black uppercase tracking-[0.04em] text-white",
                                        fileStyle.gradient,
                                    )}
                                    style={{ width: 36, height: 44 }}
                                >
                                    {fileStyle.label}
                                    <div
                                        className="absolute right-0 top-0"
                                        style={{ width: 0, height: 0, borderStyle: "solid", borderWidth: "9px 9px 0 0", borderColor: "white white transparent transparent" }}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[12.5px] font-semibold text-foreground">{file.filename}</p>
                                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                        <span>{formatFileSize(file.size)}</span>
                                        <span className="size-1.5 shrink-0 rounded-full bg-border" />
                                        <span>Enviado {uploadDate}</span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-0.5">
                                    <button
                                        type="button"
                                        title="Visualizar"
                                        onClick={() => window.open(file.url, "_blank")}
                                        className="flex h-[28px] w-[28px] items-center justify-center rounded-[5px] text-muted-foreground transition-all hover:bg-background hover:text-blue-600 hover:shadow-sm"
                                    >
                                        <Eye className="size-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        title="Baixar"
                                        onClick={() => handleFileDownload(file.id, file.filename)}
                                        className="flex h-[28px] w-[28px] items-center justify-center rounded-[5px] text-muted-foreground transition-all hover:bg-background hover:text-blue-600 hover:shadow-sm"
                                    >
                                        <Download className="size-3.5" />
                                    </button>
                                    <DeleteActionButton
                                        onDelete={() => removeFn(file.id)}
                                        itemName={file.filename}
                                        isLoading={isRemoving}
                                        className="h-[28px] w-[28px] rounded-[5px]"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
