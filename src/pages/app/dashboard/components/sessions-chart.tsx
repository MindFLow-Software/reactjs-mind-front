"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarOff, Loader2, RefreshCcw, AlertCircle } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { getDailySessionsMetrics } from "@/api/get-daily-sessions-metrics"
import type { DashboardPeriod } from "./dashboard-header"

interface SessionsBarChartProps {
    period: DashboardPeriod
}

const chartConfig = {
    count: {
        label: "Concluídas",
        color: "#22c55e",
    },
} satisfies ChartConfig

const PERIOD_DAYS: Record<DashboardPeriod, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    'year': 365,
}

const LEGEND = [
    { key: 'concluidas', label: 'Concluídas', color: 'bg-green-500' },
    { key: 'remarcadas', label: 'Remarcadas', color: 'bg-yellow-400' },
    { key: 'canceladas', label: 'Canceladas', color: 'bg-red-500' },
]

export const SessionsBarChart = React.memo(function SessionsBarChart({ period }: SessionsBarChartProps) {
    const { startDateToFetch, endDateToFetch, subtitleLabel } = React.useMemo(() => {
        const ref = new Date()
        const days = PERIOD_DAYS[period]
        const label = period === 'year' ? 'Último ano' : `Últimos ${days} dias`
        return {
            startDateToFetch: startOfDay(subDays(ref, days)),
            endDateToFetch: endOfDay(ref),
            subtitleLabel: label,
        }
    }, [period])

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["daily-sessions-bar", startDateToFetch.toISOString(), endDateToFetch.toISOString()],
        queryFn: () => getDailySessionsMetrics(
            startDateToFetch.toISOString(),
            endDateToFetch.toISOString()
        ),
        enabled: true,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const { chartData, isEmpty } = React.useMemo(() => {
        const sessions = data || []
        const total = sessions.reduce((acc, d) => acc + d.count, 0)
        return {
            chartData: sessions,
            isEmpty: sessions.length === 0 || total === 0
        }
    }, [data])

    return (
        <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-6 pt-5 pb-4 border-b border-border">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-foreground">Volume de sessões</CardTitle>
                        <CardDescription className="mt-0.5 text-xs text-muted-foreground">
                            {subtitleLabel} · sessões concluídas, canceladas e remarcadas
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 self-start">
                        {LEGEND.map(({ key, label, color }) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
                                <span className="text-xs text-muted-foreground">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 bg-card">
                {isLoading ? (
                    <div className="flex h-[250px] w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : isError ? (
                    <div className="flex h-[250px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                            <AlertCircle className="size-6" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Erro ao carregar dados</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-2 text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                        >
                            <RefreshCcw size={12} /> Tentar novamente
                        </button>
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-[250px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
                            <CalendarOff className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Nenhuma sessão</p>
                        <p className="mt-1 text-xs text-muted-foreground">Sem atendimentos neste período</p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{ left: 0, right: 0, top: 10 }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                stroke="var(--muted-foreground)"
                                fontSize={12}
                                tickFormatter={(value) => format(new Date(value), "dd MMM", { locale: ptBR })}
                            />
                            <YAxis hide domain={[0, 'auto']} />
                            <ChartTooltip
                                cursor={{ fill: "var(--muted)", opacity: 0.2, radius: 8 }}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => format(new Date(value), "dd 'de' MMMM", { locale: ptBR })}
                                        indicator="dashed"
                                    />
                                }
                            />
                            <Bar
                                dataKey="count"
                                fill="#22c55e"
                                radius={[8, 8, 0, 0]}
                                className="cursor-pointer"
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
})
