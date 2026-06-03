import "./attachments-list.css"
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
    patientId: string | null
}

export function AttachmentsList({ patientId }: AttachmentsListProps) {
    const queryClient = useQueryClient()

    const { data: attachments, isLoading } = useQuery({
        queryKey: ["attachments", patientId],
        queryFn: () => getPatientAttachments(patientId),
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
            <div className="rp-section-title">
                <FileText className="rp-section-title__icon" />
                <span className="rp-section-title__label">
                    Documentos enviados
                </span>
                {attachments && attachments.length > 0 && (
                    <span className="ml-0.5 rounded-[10px] bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {attachments.length}
                    </span>
                )}
            </div>

            {/* ToDo: Adjust nested ternary equations with more than two conditionals */}
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-blue-500/50" />
                </div>
            ) : !attachments || attachments.length === 0 ? (
                <p className="rp-att-empty">
                    Nenhum documento enviado ainda.
                </p>
            ) : (
                <div className="rp-att-grid">
                    {attachments.map((file) => {
                        const kind       = getFileKind(file.type ?? "")
                        const fileStyle  = FILE_KIND_STYLES[kind]
                        // ToDo: Adjust date formatting with date-fns, ALWAYS USE DATE-FNS FOR DATES
                        const uploadDate = new Date(file.uploadedAt).toLocaleDateString("pt-BR", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                        })

                        return (
                            <div key={file.id} className="rp-att-card">
                                <div className={cn("rp-att-badge", fileStyle.gradient)}>
                                    {fileStyle.label}
                                    <div
                                        className="absolute right-0 top-0"
                                        style={{ width: 0, height: 0, borderStyle: "solid", borderWidth: "9px 9px 0 0", borderColor: "white white transparent transparent" }}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="rp-att-name">{file.filename}</p>
                                    <div className="rp-att-meta">
                                        <span>{formatFileSize(file.size)}</span>
                                        <span className="size-1.5 shrink-0 rounded-full bg-border" />
                                        <span>Enviado {uploadDate}</span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-0.5">
                                    {/* ToDo: adicionar botões do shadcn */}
                                    <button
                                        type="button"
                                        title="Visualizar"
                                        onClick={() => window.open(file.url, "_blank")}
                                        className="rp-att-action"
                                    >
                                        <Eye className="size-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        title="Baixar"
                                        onClick={() => handleFileDownload(file.id, file.filename)}
                                        className="rp-att-action"
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
