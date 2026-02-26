"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SectionAnchor } from "./types"

interface AnamnesisNavigationProps {
    sections: SectionAnchor[]
    activeBlockId: string | null
    onJump: (id: string) => void
}

export function AnamnesisNavigation({
    sections,
    activeBlockId,
    onJump
}: AnamnesisNavigationProps) {

    // Se não houver seções (o que é raro), não renderiza nada
    if (sections.length === 0) return null

    return (
        <div className="rounded-xl bg-muted/35 p-2 border border-border/40">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                Navegação por Seções
            </p>

            {/* Container com scroll horizontal caso existam muitos blocos */}
            <div className="flex max-w-full flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {sections.map((section) => {
                    const isActive = activeBlockId === section.id

                    return (
                        <Button
                            key={section.id}
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onJump(section.id)}
                            className={cn(
                                "h-7 max-w-[200px] cursor-pointer truncate text-xs transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                    : "bg-background/50 hover:bg-background text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                            )}
                        >
                            {section.label || "Sem título"}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}