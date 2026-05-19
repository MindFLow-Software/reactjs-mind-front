"use client"

import { cn } from "@/lib/utils"

interface AnamnesisSection {
    id: string
    label: string
    wordCount: number
}

interface AnamnesisNavigationProps {
    sections: AnamnesisSection[]
    activeBlockId: string | null
    onJump: (id: string) => void
}

export function AnamnesisNavigation({
    sections,
    activeBlockId,
    onJump,
}: AnamnesisNavigationProps) {
    if (sections.length === 0) return null

    const filled = sections.filter((s) => s.wordCount > 0).length
    const total = sections.length
    const progressPct = total > 0 ? Math.round((filled / total) * 100) : 0

    return (
        <aside className="flex w-52 shrink-0 flex-col gap-0 rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2.5">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground/60"
                >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                    Seções
                </span>
            </div>

            {/* Section list */}
            <div className="flex-1 overflow-y-auto">
                {sections.map((section) => {
                    const isActive = activeBlockId === section.id
                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => onJump(section.id)}
                            className={cn(
                                "flex w-full items-center justify-between gap-2 border-l-2 px-4 py-2.5 text-left transition-all duration-150 hover:bg-muted/40",
                                isActive
                                    ? "border-l-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 text-foreground"
                                    : "border-l-transparent text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <span className={cn("text-sm truncate", isActive && "font-medium")}>
                                {section.label || "Sem título"}
                            </span>
                            <span
                                className={cn(
                                    "shrink-0 text-xs tabular-nums",
                                    section.wordCount > 0
                                        ? "text-emerald-600 font-medium"
                                        : "text-muted-foreground/50",
                                )}
                            >
                                {section.wordCount}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Progress footer */}
            <div className="border-t border-border/40 px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wide font-medium">
                        Preenchido
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600">
                        {filled}/{total}
                    </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>
        </aside>
    )
}
