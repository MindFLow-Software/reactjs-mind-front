import { Goal } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function MonthPatientsAmountCard() {
    return (
        <Card className={cn(
            "relative overflow-hidden",
            "rounded-2xl",
            "border border-border border-b-4",
            "shadow-sm shadow-black/8",
        )}>
            <div
                className={cn(
                    "absolute -top-16 -right-16",
                    "w-48 h-48",
                    "rounded-full",
                    "bg-linear-to-br from-purple-400/70 to-purple-800/70",
                    "blur-3xl opacity-60",
                    "pointer-events-none"
                )}
            />

            <div className="relative z-1 p-3 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-100 dark:bg-purple-950/40 p-2.5">
                            <Goal className="size-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight">
                            58
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">
                            Sessões Realizadas (Mês)
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                                +12%
                            </span>
                            {' em relação ao mês anterior'}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}