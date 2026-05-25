import { Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { formatFileSize } from "@/utils/format-file-size"
import type { FileItem } from "@/hooks/use-upload"
import { FileThumb } from "./file-thumb"

interface FileListProps {
    files:    FileItem[]
    onRemove: (id: string) => void
    onClear:  () => void
}

export function FileList({ files, onRemove, onClear }: FileListProps) {
    if (files.length === 0) return null

    return (
        <div className="space-y-2 shrink-0">
            <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {files.length} {files.length === 1 ? "arquivo" : "arquivos"}
                </p>
                <button
                    type="button"
                    onClick={onClear}
                    className="text-[12px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                    Limpar tudo
                </button>
            </div>

            {files.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                    <FileThumb type={item.file.type} />

                    <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-[13px] font-semibold text-foreground truncate">
                            {item.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="text-[11px] text-muted-foreground">
                                {formatFileSize(item.file.size)}
                            </p>
                            {item.status === "error" && (
                                <p className="text-[11px] text-destructive font-medium">
                                    {item.error}
                                </p>
                            )}
                        </div>

                        {item.status === "uploading" && (
                            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-300"
                                    style={{ width: `${item.progress}%` }}
                                />
                            </div>
                        )}
                        {item.status === "done" && (
                            <div className="h-1 w-full rounded-full bg-green-500/30">
                                <div className="h-full w-full rounded-full bg-green-500" />
                            </div>
                        )}
                        {item.status === "error" && (
                            <div className="h-1 w-full rounded-full bg-destructive/30">
                                <div className="h-full w-full rounded-full bg-destructive" />
                            </div>
                        )}
                    </div>

                    <div className="shrink-0">
                        {item.status === "uploading" && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                        {item.status === "done" && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {item.status === "error" && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        {item.status === "pending" && (
                            <button
                                type="button"
                                onClick={() => onRemove(item.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
