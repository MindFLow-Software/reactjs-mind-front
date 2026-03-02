"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    FileText,
    Image as ImageIcon,
    Eye,
    ArrowDownToLine,
    Loader2,
    FileSearch,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { getPatientAttachments } from "@/api/attachments"
import { handleFileDownload } from "@/utils/handle-file-download"
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
                    <Loader2 className="size-8 animate-spin text-blue-500/40" />
                    <p className="text-xs text-muted-foreground mt-2">Sincronizando arquivos...</p>
                </div>
            ) : attachments && attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {attachments.map((doc: any) => (
                        <Card key={doc.id} className="group hover:border-blue-400/50 transition-all shadow-sm border-blue-50 bg-white/50 backdrop-blur-sm overflow-hidden">
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
                                        {doc.contentType?.toLowerCase().includes("image") ? (
                                            <ImageIcon className="size-5 text-blue-500" />
                                        ) : (
                                            <FileText className="size-5 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate leading-tight text-slate-900" title={doc.filename}>
                                            {doc.filename || "Arquivo"}
                                        </p>
                                        <p className="text-[10px] text-blue-500/60 font-bold mt-1 uppercase">
                                            {doc.uploadedAt ? format(new Date(doc.uploadedAt), "dd MMM yyyy", { locale: ptBR }) : "--"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 cursor-pointer hover:bg-blue-100 hover:text-blue-600 rounded-full"
                                        onClick={() => setPreviewFile(doc)}
                                    >
                                        <Eye className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-full"
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
                <div className="flex flex-col items-center py-16 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/20 text-blue-600/40">
                    <FileSearch className="size-10 mb-2 opacity-50" />
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