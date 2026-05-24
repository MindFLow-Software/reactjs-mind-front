"use client"

import { useState, useCallback } from "react"
import { Paperclip } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { AttachmentsTableRow } from "./attachments-table-row"
import type { Attachment } from "@/api/attachments/attachments"
import { BulkDeleteAction } from "./bulk-delete-action"

interface AttachmentsTableProps {
    attachments: Attachment[]
    isLoading: boolean
    onDelete: (id: string) => void
    onPreview: (doc: Attachment) => void
    previewDocId?: string
    perPage?: number
}

export function AttachmentsTable({
    attachments,
    isLoading,
    onDelete,
    onPreview,
    previewDocId,
    perPage = 10,
}: AttachmentsTableProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const columnCount = 7

    const isAllSelected = attachments.length > 0 && selectedIds.length === attachments.length
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < attachments.length

    const handleSelectAll = useCallback((checked: boolean) => {
        setSelectedIds(checked ? attachments.map((d) => d.id) : [])
    }, [attachments])

    const handleToggleSelect = useCallback((id: string, checked: boolean) => {
        setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id))
    }, [])

    const handleBulkDelete = useCallback(() => {
        selectedIds.forEach((id) => onDelete(id))
        setSelectedIds([])
    }, [selectedIds, onDelete])

    return (
        <div className="space-y-3 w-full">
            {selectedIds.length > 0 && (
                <BulkDeleteAction
                    selectedCount={selectedIds.length}
                    onConfirm={handleBulkDelete}
                    isDeleting={false}
                    onClear={() => setSelectedIds([])}
                />
            )}

            <div className="rounded-xl border bg-background shadow-sm overflow-hidden w-full">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30 whitespace-nowrap">
                            <TableHead className="w-[42px] px-4">
                                <Checkbox
                                    checked={isAllSelected}
                                    ref={(el) => {
                                        if (el) (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = isIndeterminate
                                    }}
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    aria-label="Selecionar todos"
                                    className="cursor-pointer"
                                />
                            </TableHead>
                            <TableHead className="text-[11px] uppercase tracking-[0.06em] font-semibold text-muted-foreground/80">
                                Nome
                            </TableHead>
                            <TableHead className="text-[11px] uppercase tracking-[0.06em] font-semibold text-muted-foreground/80 min-w-[180px]">
                                Paciente
                            </TableHead>
                            <TableHead className="text-[11px] uppercase tracking-[0.06em] font-semibold text-muted-foreground/80 w-[100px]">
                                Tamanho
                            </TableHead>
                            <TableHead className="text-[11px] uppercase tracking-[0.06em] font-semibold text-muted-foreground/80 w-[130px]">
                                Enviado em
                            </TableHead>
                            <TableHead className="text-[11px] uppercase tracking-[0.06em] font-semibold text-muted-foreground/80 w-[90px]">
                                Tipo
                            </TableHead>
                            <TableHead className="text-right pr-4 text-[11px] uppercase tracking-[0.06em] font-semibold text-muted-foreground/80 w-[110px]">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: perPage }).map((_, i) => (
                                <TableRow key={`sk-${i}`}>
                                    <TableCell className="px-4"><Skeleton className="h-4 w-4 rounded" /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-11 w-9 rounded-md" />
                                            <div className="space-y-1.5">
                                                <Skeleton className="h-3 w-[140px]" />
                                                <Skeleton className="h-2.5 w-[60px]" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-3 w-[100px]" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-3 w-[60px]" /></TableCell>
                                    <TableCell><Skeleton className="h-3 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-[60px] rounded-full" /></TableCell>
                                    <TableCell className="text-right pr-4">
                                        <div className="flex justify-end gap-1.5">
                                            <Skeleton className="h-7 w-7 rounded-md" />
                                            <Skeleton className="h-7 w-7 rounded-md" />
                                            <Skeleton className="h-7 w-7 rounded-md" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : attachments.length > 0 ? (
                            attachments.map((doc) => (
                                <AttachmentsTableRow
                                    key={doc.id}
                                    attachment={doc}
                                    isSelected={selectedIds.includes(doc.id)}
                                    isActivePreview={previewDocId === doc.id}
                                    onSelectChange={(checked) => handleToggleSelect(doc.id, checked)}
                                    onDelete={onDelete}
                                    onPreview={onPreview}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="text-center text-muted-foreground py-20">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="p-4 rounded-full bg-muted">
                                            <Paperclip className="h-9 w-9 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">Nenhum documento encontrado.</p>
                                        <p className="text-xs text-muted-foreground/60">Ajuste os filtros ou envie um novo arquivo.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
