"use client"

import { useQuery } from "@tanstack/react-query"
import { Inbox, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getTotalSuggestionsCard } from "@/api/get-total-suggestions-card"

export const TotalSuggestionsCard = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-total-suggestions"],
        queryFn: getTotalSuggestionsCard,
    })

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "rounded-xl border bg-card shadow-sm",
                "p-4 transition-all duration-300 hover:shadow-md",
                "border-l-4 border-l-amber-500" // Cor Laranja para Sugestões
            )}
        >
            <div className="relative z-10 flex flex-col">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-amber-500/10 p-2 border border-amber-500/20">
                            <Inbox className="size-4 text-amber-500" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                Total de Sugestões
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Feedbacks da MindFlush
                            </span>
                        </div>
                    </div>
                </div>

                <Separator className="my-4 bg-transparent border-t-2 border-dashed border-muted-foreground/30" />

                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                ) : isError ? (
                    <div className="flex items-center gap-2 text-red-500 py-2">
                        <AlertCircle className="size-4" />
                        <span className="text-sm font-medium">Erro ao carregar dados</span>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
                                {data?.total !== undefined ? data.total.toLocaleString("pt-BR") : "0"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}