"use client"

import { Eye, ArrowDownToLine } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { handleFileDownload } from "@/utils/handle-file-download"
import { formatFileSize } from "@/utils/format-file-size"
import { cn } from "@/lib/utils"
import type { AttachmentPatientItem } from "@/types/attachment"

interface FileCardProps {
    file: AttachmentPatientItem
    onPreview: (file: AttachmentPatientItem) => void
}

function getTypeBadge(mime: string): { label: string; className: string } {
    if (mime.includes("pdf")) return { label: "PDF", className: "bg-red-600 text-white" }
    if (mime.includes("image")) return { label: "IMG", className: "bg-teal-600 text-white" }
    return { label: "DOC", className: "bg-gray-500 text-white" }
}

export function FileCard({ file, onPreview }: FileCardProps) {
    const badge = getTypeBadge(file.type)
    const dateLabel = file.uploadedAt
        ? format(new Date(file.uploadedAt), "dd MMM yyyy", { locale: ptBR })
        : "—"

    return (
        <div className="group relative flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 transition-shadow hover:shadow-sm">
            <div
                className={cn(
                    "h-11 w-11 flex-shrink-0 rounded-lg flex items-center justify-center text-[11px] font-bold tracking-wide",
                    badge.className,
                )}
            >
                {badge.label}
            </div>

            <div className="min-w-0 flex-1">
                <p
                    className="text-sm font-semibold truncate leading-tight text-foreground"
                    title={file.filename}
                >
                    {file.filename}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatFileSize(file.size)} · {dateLabel}
                </p>
            </div>

            <div className="absolute right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer hover:bg-muted rounded-full"
                    onClick={() => onPreview(file)}
                >
                    <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer hover:bg-muted rounded-full"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleFileDownload(file.id, file.filename)
                    }}
                >
                    <ArrowDownToLine className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    )
}
