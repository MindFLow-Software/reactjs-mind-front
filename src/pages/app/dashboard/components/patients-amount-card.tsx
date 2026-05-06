"use client"

import { memo, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { subDays, startOfDay, endOfDay } from "date-fns"
import { Users, TrendingUp, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getAmountPatientsCard } from "@/api/get-amount-patients-card"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"
import { cn } from "@/lib/utils"

export const PatientsAmountCard = memo(function PatientsAmountCard() {
    const { data: cardData, isLoading: loadingTotal, isError } = useQuery({
        queryKey: ['dashboard', 'patients-total'],
        queryFn: getAmountPatientsCard,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const now = useMemo(() => new Date(), [])
    const { data: recentData, isLoading: loadingRecent } = useQuery({
        queryKey: ['dashboard', 'patients-recent-30d'],
        queryFn: () => getAmountPatientsChart({
            startDate: startOfDay(subDays(now, 30)),
            endDate: endOfDay(now),
        }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const delta = useMemo(() => {
        if (!recentData) return null
        return recentData.reduce((acc, d) => acc + d.newPatients, 0)
    }, [recentData])

    const isLoading = loadingTotal || loadingRecent

    return (
        <Card className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            {/* faixa de cor no topo */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-blue-400 to-blue-600" />
            <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">Pacientes ativos</p>
                <div className="rounded-lg bg-blue-500/10 p-2 ring-1 ring-blue-500/20">
                    <Users className="size-4 text-blue-500" />
                </div>
            </div>

            {isLoading ? (
                <div className="mt-3 space-y-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-5 w-36" />
                </div>
            ) : isError ? (
                <div className="mt-3 flex items-center gap-2 text-red-500">
                    <AlertCircle className="size-4" />
                    <span className="text-sm">Erro ao carregar</span>
                </div>
            ) : (
                <div className="mt-3">
                    <p className="text-4xl font-bold tabular-nums text-foreground">
                        {(cardData?.total ?? 0).toLocaleString('pt-BR')}
                    </p>
                    {delta !== null && delta > 0 && (
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className={cn(
                                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold",
                                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            )}>
                                <TrendingUp className="size-3" />
                                +{delta}
                            </span>
                            <span className="text-xs text-muted-foreground">vs. 30 dias anteriores</span>
                        </div>
                    )}
                </div>
            )}
        </Card>
    )
})
