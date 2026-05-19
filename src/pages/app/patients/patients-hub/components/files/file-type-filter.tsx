import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type FileTypeFilter = "all" | "pdf" | "image" | "audio"

export function getFileType(mime: string): Exclude<FileTypeFilter, "all"> {
    if (mime.includes("pdf")) return "pdf"
    if (mime.includes("image")) return "image"
    if (mime.includes("audio")) return "audio"
    return "pdf"
}

const CHIPS: { key: FileTypeFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "pdf", label: "PDFs" },
    { key: "image", label: "Imagens" },
    { key: "audio", label: "Áudios" },
]

interface FileTypeFilterProps {
    filter: FileTypeFilter
    counts: Record<FileTypeFilter, number>
    onFilterChange: (f: FileTypeFilter) => void
}

export function FileTypeFilter({ filter, counts, onFilterChange }: FileTypeFilterProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
                {CHIPS.map((chip) => {
                    const active = filter === chip.key
                    return (
                        <button
                            key={chip.key}
                            type="button"
                            onClick={() => onFilterChange(chip.key)}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                                active
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-border bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                            )}
                        >
                            {chip.label}
                            <span
                                className={cn(
                                    "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums font-semibold",
                                    active ? "bg-white/25 text-white" : "bg-muted text-muted-foreground",
                                )}
                            >
                                {counts[chip.key]}
                            </span>
                        </button>
                    )
                })}
            </div>

            <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground font-medium cursor-default opacity-80"
                tabIndex={-1}
            >
                <ArrowUpDown className="h-3.5 w-3.5" />
                Mais recentes
            </Button>
        </div>
    )
}
