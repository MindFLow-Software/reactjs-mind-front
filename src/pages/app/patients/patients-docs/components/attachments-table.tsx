"use client"

import { Paperclip } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { AttachmentsTableRow } from "./attachments-table-row" // 🟢 Importado o novo componente
import type { Attachment } from "@/api/attachments"

interface AttachmentsTableProps {
    attachments: Attachment[]
    isLoading: boolean
    onDelete: (id: string) => void
    perPage?: number
}

export function AttachmentsTable({ attachments, isLoading, onDelete, perPage = 10 }: AttachmentsTableProps) {
    const columnCount = 5

    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 whitespace-nowrap">
                        <TableHead className="w-[10px]"></TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Arquivo</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Paciente</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Tamanho</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Data de Upload</TableHead>
                        <TableHead className="text-right pr-7 text-xs uppercase tracking-wider font-semibold">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        Array.from({ length: perPage }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-[140px]" />
                                            <Skeleton className="h-3 w-[60px]" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[120px]" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[80px]" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[80px]" />
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-2">
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : attachments.length > 0 ? (
                        attachments.map((doc) => (
                            <AttachmentsTableRow
                                key={doc.id}
                                attachment={doc}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columnCount} className="text-center text-muted-foreground py-20">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="p-4 rounded-full bg-muted">
                                        <Paperclip className="h-10 w-10 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-sm font-medium">Nenhum documento encontrado.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}