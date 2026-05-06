"use client"

import { memo, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { subDays, startOfDay, endOfDay } from "date-fns"
import { CalendarCheck, TrendingUp, TrendingDown, AlertCircle, RefreshCcw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getMonthlySessionsCount } from "@/api/get-monthly-sessions-count"
import { cn } from "@/lib/utils"

interface MonthPatientsAmountCardProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export const MonthPatientsAmountCard = memo(function MonthPatientsAmountCard({
    startDate,
    endDate,
}: MonthPatientsAmountCardProps) {
    const now = useMemo(() => new Date(), [])

    const { data: current, isLoading: loadingCurrent, isError, refetch } = useQuery({
        queryKey: ['dashboard', 'month-sessions-current', startDate?.toISOString(), endDate?.toISOString()],
        queryFn: () => getMonthlySessionsCount({
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
        }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const prevStart = useMemo(() => startOfDay(subDays(now, 60)), [now])
    const prevEnd = useMemo(() => endOfDay(subDays(now, 30)), [now])

    const { data: previous, isLoading: loadingPrev } = useQuery({
        queryKey: ['dashboard', 'month-sessions-prev', prevStart.toISOString(), prevEnd.toISOString()],
        queryFn: () => getMonthlySessionsCount({
            startDate: prevStart.toISOString(),
            endDate: prevEnd.toISOString(),
        }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const { pct, isPositive } = useMemo(() => {
        const curr = current?.count ?? 0
        const prev = previous?.count ?? 0
        if (prev === 0 || !previous) return { pct: null, isPositive: true }
        const diff = ((curr - prev) / prev) * 100
        return { pct: Math.abs(diff).toFixed(0), isPositive: diff >= 0 }
    }, [current, previous])

    const isLoading = loadingCurrent || loadingPrev

    return (
        <Card className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-violet-400 to-violet-600" />
            <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">Sessões no mês</p>
                <div className="rounded-lg bg-violet-500/10 p-2 ring-1 ring-violet-500/20">
                    <CalendarCheck className="size-4 text-violet-500" />
                </div>
            </div>

            {isLoading ? (
                <div className="mt-3 space-y-2">
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-5 w-40" />
                </div>
            ) : isError ? (
                <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertCircle className="size-4" />
                        <span className="text-sm">Erro ao carregar</span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline"
                    >
                        <RefreshCcw className="size-3" /> Tentar novamente
                    </button>
                </div>
            ) : (
                <div className="mt-3">
                    <p className="text-4xl font-bold tabular-nums text-foreground">
                        {(current?.count ?? 0).toLocaleString('pt-BR')}
                    </p>
                    {pct !== null && (
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className={cn(
                                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold",
                                isPositive
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            )}>
                                {isPositive
                                    ? <TrendingUp className="size-3" />
                                    : <TrendingDown className="size-3" />
                                }
                                {isPositive ? '+' : '-'}{pct}%
                            </span>
                            <span className="text-xs text-muted-foreground">vs. mês anterior</span>
                        </div>
                    )}
                </div>
            )}
        </Card>
    )
})
