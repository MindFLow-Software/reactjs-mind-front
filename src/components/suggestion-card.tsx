"use client"

import { ChevronUp, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Suggestion } from "@/api/suggestions/get-suggestions"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { SuggestionDetailModalContent } from "@/components/suggestion-detail-modal"

type CategoryKey = Suggestion["category"]

const CATEGORY_CONFIG: Record<CategoryKey, {
    label: string
    dot: string
    pillBg: string
    pillText: string
}> = {
    UI_UX:        { label: "Fluxo",       dot: "bg-violet-500",  pillBg: "bg-violet-50",  pillText: "text-violet-700"  },
    REPORTS:      { label: "Relatórios",  dot: "bg-amber-500",   pillBg: "bg-amber-50",   pillText: "text-amber-700"   },
    INTEGRATIONS: { label: "Integrações", dot: "bg-blue-500",    pillBg: "bg-blue-50",    pillText: "text-blue-700"    },
    SCHEDULING:   { label: "Paciente",    dot: "bg-pink-500",    pillBg: "bg-pink-50",    pillText: "text-pink-700"    },
    PRIVACY_LGPD: { label: "Financeiro",  dot: "bg-emerald-500", pillBg: "bg-emerald-50", pillText: "text-emerald-700" },
    OTHERS:       { label: "Outros",      dot: "bg-slate-400",   pillBg: "bg-slate-100",  pillText: "text-slate-600"   },
}

interface SuggestionCardProps {
    item: Suggestion
    userId?: string
    onLike: (id: string) => void
}

export function SuggestionCard({ item, userId, onLike }: SuggestionCardProps) {
    const isLiked       = userId ? item.likes?.includes(userId) : false
    const isImplemented = item.status === "IMPLEMENTED"
    const isPlanned     = item.status === "PLANNED"
    const cat           = CATEGORY_CONFIG[item.category]

    const initials = item.psychologistName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0] ?? "")
        .join("")
        .toUpperCase()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <article
                    className={cn(
                        "flex gap-3.5 rounded-xl p-[14px] cursor-pointer transition-all duration-200 group border min-w-0 w-full min-h-[110px]",
                        isImplemented
                            ? "bg-card border-border hover:-translate-y-px hover:border-emerald-300 hover:shadow-sm"
                            : isLiked
                                ? "bg-blue-50/40 border-blue-200 hover:-translate-y-px hover:shadow-md"
                                : "bg-card border-border hover:-translate-y-px hover:border-blue-400 hover:shadow-md"
                    )}
                >
                    {isImplemented ? (
                        <div className="flex flex-col items-center justify-center gap-1.5 shrink-0 w-11 min-h-[88px] self-stretch rounded-xl bg-emerald-100 dark:bg-emerald-950/30">
                            <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                <Check className="size-[15px] text-white" strokeWidth={3} />
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onLike(item.id) }}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 shrink-0 w-11 min-h-[88px] self-stretch rounded-xl transition-all cursor-pointer active:scale-95",
                                isPlanned
                                    ? "bg-gradient-to-b from-blue-600 to-blue-500 text-white shadow-sm shadow-blue-500/30"
                                    : isLiked
                                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                            )}
                        >
                            <ChevronUp className="size-4" strokeWidth={2.5} />
                            <span className="text-2xl font-extrabold tabular-nums leading-none">{item.likesCount}</span>
                        </button>
                    )}

                    <div className="flex-1 min-w-0 space-y-1.5">
                        <h3 className={cn(
                            "font-bold leading-snug line-clamp-2 break-words transition-colors text-[14.5px]",
                            isImplemented
                                ? "text-foreground/60"
                                : "text-foreground group-hover:text-primary"
                        )}>
                            {item.title}
                        </h3>

                        {!isImplemented && (
                            <p className="text-[12px] text-muted-foreground line-clamp-1 leading-relaxed break-words">
                                {item.description}
                            </p>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn(
                                "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0",
                                cat.pillBg, cat.pillText
                            )}>
                                <span className={cn("size-1.5 rounded-full shrink-0", cat.dot)} />
                                {cat.label}
                            </span>

                            <div className="ml-auto shrink-0">
                                <div className="size-5 rounded-full bg-muted border border-border flex items-center justify-center text-[9px] font-bold text-foreground/60">
                                    {initials}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </DialogTrigger>

            <SuggestionDetailModalContent item={item} userId={userId} onLike={onLike} />
        </Dialog>
    )
}
