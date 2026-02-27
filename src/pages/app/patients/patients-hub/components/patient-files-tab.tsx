"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    FileText,
    Image as ImageIcon,
    Eye,
    ArrowDownToLine, // 🟢 Trocado para o ícone padrão
    Loader2,
    FileSearch
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { getPatientAttachments } from "@/api/attachments"
import { handleFileDownload } from "@/utils/handle-file-download" // 🟢 Importado o utilitário
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SimplePreviewModal } from "./simple-preview-modal"

export function PatientFilesTab({ patientId }: { patientId: string }) {
    const [previewFile, setPreviewFile] = useState<any>(null)

    const { data: attachments, isLoading } = useQuery({
        queryKey: ["patient-attachments", patientId],
        queryFn: () => getPatientAttachments(patientId),
        enabled: !!patientId,
    })

    return (
        <div className="space-y-4 mt-4">
            {isLoading ? (
                <div className="flex flex-col items-center py-20">
                    <Loader2 className="size-8 animate-spin text-blue-600" />
                    <p className="text-xs text-muted-foreground mt-2">Buscando documentos...</p>
                </div>
            ) : attachments && attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {attachments.map((doc: any) => (
                        <Card key={doc.id} className="group hover:border-blue-500/50 transition-all shadow-sm border-muted-foreground/10">
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        {doc.contentType?.toLowerCase().includes("image") ? (
                                            <ImageIcon className="size-5 text-blue-500" />
                                        ) : (
                                            <FileText className="size-5 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate leading-tight">
                                            {doc.filename || "Arquivo"}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                                            {doc.uploadedAt ? format(new Date(doc.uploadedAt), "dd MMM yyyy", { locale: ptBR }) : "--"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 cursor-pointer hover:bg-blue-100 hover:text-blue-600"
                                        onClick={() => setPreviewFile(doc)}
                                    >
                                        <Eye className="size-4" />
                                    </Button>

                                    {/* 🟢 Botão de Download agora usando handleFileDownload */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleFileDownload(doc.id, doc.filename)
                                        }}
                                    >
                                        <ArrowDownToLine className="size-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center py-16 border-2 border-dashed rounded-2xl bg-muted/5 text-muted-foreground">
                    <FileSearch className="size-10 mb-2 opacity-20" />
                    <p className="text-sm font-medium">Nenhum documento encontrado.</p>
                </div>
            )}

            <SimplePreviewModal
                file={previewFile}
                onClose={() => setPreviewFile(null)}
            />
        </div>
    )
}