"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FileText, Loader2, ArrowDownToLine } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FieldSet } from "@/components/ui/field"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getPatientAttachments, deleteAttachment } from "@/api/attachments"
import { handleFileDownload } from "@/utils/handle-file-download"
import { Label } from "@/components/ui/label"
import { DeleteActionButton } from "./delete-action-button"

interface AttachmentsListProps {
    patientId: string
}

export function AttachmentsList({ patientId }: AttachmentsListProps) {
    const queryClient = useQueryClient()



    const { data: attachments, isLoading } = useQuery({
        queryKey: ["attachments", patientId],
        queryFn: () => getPatientAttachments(patientId)
    })

    // src/components/attachments-list.tsx

    const { mutateAsync: removeFn, isPending: isRemoving } = useMutation({
        mutationFn: deleteAttachment,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["attachments", patientId],
                exact: true
            })

            toast.success("Documento removido.")
        },
        onError: () => {
            toast.error("Erro ao sincronizar exclusão com o servidor.")
        }
    })

    return (
        <div className="pt-2 border-t mt-4">
            <div className="flex items-center mb-3 px-1">
                <Label className="block font-medium">
                    Documentos do Paciente
                </Label>
            </div>

            <FieldSet className="border-none p-0 shadow-none">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
                    </div>
                ) : attachments?.length === 0 ? (
                    <Empty className="py-6 border-none bg-transparent">
                        <EmptyHeader className="flex flex-col items-center">
                            <EmptyMedia className="opacity-20 mb-2">
                                <FileText className="h-8 w-8" />
                            </EmptyMedia>
                            <EmptyTitle className="text-xs font-normal text-muted-foreground text-center">
                                Nenhum registro anexado
                            </EmptyTitle>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="grid gap-1 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted">
                        {attachments?.map((file: any) => (
                            <div
                                key={file.id}
                                className="group flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:bg-muted/30 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-10 w-10 rounded-full bg-muted/40 flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4 text-muted-foreground/70" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[13px] font-medium text-foreground/80 truncate">
                                            {file.filename}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground/60">
                                            {format(new Date(file.uploadedAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        className="cursor-pointer h-8 w-8 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => handleFileDownload(file.url, file.filename)}
                                        title="Baixar arquivo"
                                    >
                                        <ArrowDownToLine className="h-4 w-4" />
                                    </Button>

                                    <DeleteActionButton
                                        onDelete={() => removeFn(file.id)}
                                        itemName={file.filename}
                                        isLoading={isRemoving}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </FieldSet>
        </div>
    )
}