"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { subDays, startOfDay, endOfDay } from "date-fns"
import { Users, AlertCircle, RefreshCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/axios"
import type { DashboardPeriod } from "./dashboard-header"

interface AgeStats {
    ageRange: string
    patients: number
}

async function getPatientsByAgeStats(params: { startDate?: string; endDate?: string }): Promise<AgeStats[]> {
    const response = await api.get<AgeStats[]>("/patients/stats/age", { params })
    return response.data
}

const PERIOD_DAYS: Record<DashboardPeriod, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    'year': 365,
}

interface PatientsByAgeChartProps {
    period: DashboardPeriod
}

export const PatientsByAgeChart = React.memo(function PatientsByAgeChart({ period }: PatientsByAgeChartProps) {
    const { startDateToFetch, endDateToFetch } = React.useMemo(() => {
        const ref = new Date()
        const days = PERIOD_DAYS[period]
        return {
            startDateToFetch: startOfDay(subDays(ref, days)),
            endDateToFetch: endOfDay(ref),
        }
    }, [period])

    const { data, isLoading, isError, refetch } = useQuery<AgeStats[]>({
        queryKey: ['dashboard', 'age-stats', startDateToFetch, endDateToFetch],
        queryFn: () => getPatientsByAgeStats({
            startDate: startDateToFetch.toISOString(),
            endDate: endDateToFetch.toISOString()
        }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const maxValue = React.useMemo(
        () => Math.max(...(data?.map(d => d.patients) ?? [1])),
        [data]
    )

    const isEmpty = !data || data.length === 0 || data.every(d => d.patients === 0)

    return (
        <Card className="border-border bg-card shadow-sm rounded-2xl flex flex-col">
            <CardHeader className="px-6 pt-5 pb-4">
                <CardTitle className="text-base font-semibold text-foreground">Pacientes por faixa etária</CardTitle>
                <CardDescription className="text-xs text-blue-500 font-medium">Distribuição atual</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 px-6 pb-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-3 w-14 shrink-0" />
                                <Skeleton className="h-2.5 flex-1" />
                                <Skeleton className="h-3 w-8 shrink-0" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                        <AlertCircle className="size-5 text-red-500" />
                        <p className="text-sm text-red-500">Erro ao carregar</p>
                        <button
                            onClick={() => refetch()}
                            className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline"
                        >
                            <RefreshCcw size={12} /> Tentar novamente
                        </button>
                    </div>
                ) : isEmpty ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30">
                            <Users className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Sem dados</p>
                        <p className="text-xs text-muted-foreground">Nenhum paciente neste período</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map((item) => {
                            const pct = maxValue > 0 ? (item.patients / maxValue) * 100 : 0
                            return (
                                <div key={item.ageRange} className="flex items-center gap-4">
                                    <span className="w-14 shrink-0 text-sm font-medium text-muted-foreground tabular-nums whitespace-nowrap">
                                        {item.ageRange}
                                    </span>
                                    <div className="flex-1 overflow-hidden rounded-full bg-muted h-2.5">
                                        <div
                                            className="h-2.5 rounded-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
                                        />
                                    </div>
                                    <span className="w-8 shrink-0 text-right text-sm font-semibold text-foreground tabular-nums">
                                        {item.patients}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
})
