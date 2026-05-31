"use client"

import { Trash2, Download, Eye, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { handleFileDownload } from "@/utils/handle-file-download"
import { formatFileSize } from "@/utils/format-file-size"
import type { Attachment } from "@/api/attachments/attachments"
import { getFileKind, FILE_KIND_STYLES, TYPE_BADGE } from "@/utils/file-helpers"

interface AttachmentsTableRowProps {
    attachment:      Attachment
    isSelected:      boolean
    isActivePreview: boolean
    onSelectChange:  (checked: boolean) => void
    onDelete:        (id: string) => void
    onPreview:       (doc: Attachment) => void
}

function DocThumb({ contentType, filename }: { contentType: string; filename: string }) {
    const kind  = getFileKind(contentType)
    const style = FILE_KIND_STYLES[kind]
    const ext   = filename.split(".").pop()?.toUpperCase().slice(0, 4) ?? style.label

    return (
        <div className={cn(
            "relative flex h-11 w-9 shrink-0 items-end justify-center rounded-md bg-gradient-to-br overflow-hidden",
            style.gradient,
        )}>
            <div className="absolute top-0 right-0 w-0 h-0 border-b-[8px] border-b-transparent border-l-[8px] border-l-white/25" />
            <span className="mb-1 text-[8px] font-bold tracking-tight" style={{ color: style.labelColor }}>
                {ext}
            </span>
        </div>
    )
}

function PatientAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
    const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-[11px] font-bold text-white select-none">
            {initials}
        </div>
    )
}

export function AttachmentsTableRow({
    attachment,
    isSelected,
    isActivePreview,
    onSelectChange,
    onDelete,
    onPreview,
}: AttachmentsTableRowProps) {
    const { id, filename, contentType, sizeInBytes, uploadedAt, patient } = attachment
    const kind  = getFileKind(contentType)
    const badge = TYPE_BADGE[kind]

    return (
        <TooltipProvider delayDuration={200}>
            <TableRow
                onClick={() => onPreview(attachment)}
                className={cn(
                    "group cursor-pointer transition-colors border-l-2 border-l-transparent",
                    isActivePreview
                        ? "bg-blue-50 dark:bg-blue-950/20 border-l-primary"
                        : isSelected
                        ? "bg-primary/5 border-l-primary/40"
                        : "hover:bg-blue-50/60 dark:hover:bg-blue-950/10 hover:border-l-primary/30",
                )}
            >
                <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(c) => onSelectChange(!!c)}
                        aria-label={`Selecionar ${filename}`}
                        className="cursor-pointer"
                    />
                </TableCell>

                {/* Name */}
                <TableCell>
                    <div className="flex items-center gap-3">
                        <DocThumb contentType={contentType} filename={filename} />
                        <div className="min-w-0">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <p className="max-w-[180px] truncate text-[13.5px] font-semibold text-foreground leading-tight">
                                        {filename}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">{filename}</TooltipContent>
                            </Tooltip>
                            <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                                {formatFileSize(sizeInBytes)}
                            </p>
                        </div>
                    </div>
                </TableCell>

                {/* Patient */}
                <TableCell>
                    {patient ? (
                        <div className="flex items-center gap-2.5">
                            <PatientAvatar firstName={patient.firstName} lastName={patient.lastName} />
                            <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-foreground truncate max-w-[130px]">
                                    {patient.firstName} {patient.lastName}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            Sem vínculo
                        </span>
                    )}
                </TableCell>

                {/* Size */}
                <TableCell>
                    <span className="font-mono text-[12.5px] font-medium text-muted-foreground tabular-nums">
                        {formatFileSize(sizeInBytes)}
                    </span>
                </TableCell>

                {/* Date */}
                <TableCell>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-foreground tabular-nums">
                            {uploadedAt ? format(new Date(uploadedAt), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                        </span>
                        {uploadedAt && (
                            <span className="text-[11px] text-muted-foreground">
                                {format(new Date(uploadedAt), "HH:mm")}
                            </span>
                        )}
                    </div>
                </TableCell>

                {/* Type badge */}
                <TableCell>
                    <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        badge.bg, badge.text,
                    )}>
                        {badge.label}
                    </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end items-center gap-1 pr-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-md text-muted-foreground hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer"
                                    onClick={() => onPreview(attachment)}
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">Visualizar</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer"
                                    onClick={() => handleFileDownload(id, filename)}
                                >
                                    <Download className="h-3.5 w-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">Baixar</TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                                        >
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">Mais ações</TooltipContent>
                            </Tooltip>

                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2 text-[13px]"
                                    onClick={() => onPreview(attachment)}
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2 text-[13px]"
                                    onClick={() => handleFileDownload(id, filename)}
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    Baixar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2 text-[13px] text-destructive focus:text-destructive"
                                    onClick={() => onDelete(id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Excluir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TableCell>
            </TableRow>
        </TooltipProvider>
    )
}
