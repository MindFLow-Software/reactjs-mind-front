"use client"

import { Goal, AlertCircle, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getMonthlySessionsCount } from "@/api/get-monthly-sessions-count"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

interface MonthPatientsAmountCardProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export function MonthPatientsAmountCard({ startDate, endDate }: MonthPatientsAmountCardProps) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [
            "month-sessions-count",
            startDate?.toISOString(),
            endDate?.toISOString()
        ],
        queryFn: () => getMonthlySessionsCount({
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
        }),
        staleTime: 1000 * 60 * 5,
    })

    const total = data?.count ?? null

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "rounded-xl border bg-card shadow-sm",
                "p-4 transition-all duration-300 hover:shadow-md",
                "border-l-4 border-accent-primary"
            )}
        >
            <div className="relative z-10 flex flex-col">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#4f35e1]/10 p-2 border border-[#4f35e1]/20">
                            <Goal className="size-4 text-[#4f35e1]" />
                        </div>

                        <div className="flex flex-col">
                            <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                Sessões do Mês
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                Atendimentos no mês
                            </CardDescription>
                        </div>
                    </div>
                </div>

                {/* FIX AQUI: Substituído Separator por div para garantir o efeito Full-Bleed */}
                <div
                    className="h-0 -mx-4 my-4 w-[calc(100%+2rem)] border-t-2 border-dashed border-muted-foreground/30"
                    aria-hidden="true"
                />

                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-start gap-2 py-1">
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="size-4" />
                            <span className="text-sm font-medium">Erro ao carregar</span>
                        </div>
                        <button onClick={() => refetch()} className="group flex items-center gap-1.5 text-xs text-[#5a189a] font-semibold hover:underline">
                            <RefreshCcw className="size-3 transition-transform group-hover:rotate-180 duration-500" />
                            Tentar novamente
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
                                {total?.toLocaleString("pt-BR") ?? "0"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}