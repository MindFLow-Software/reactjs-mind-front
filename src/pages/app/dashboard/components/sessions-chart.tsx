"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { CalendarOff, RefreshCcw, AlertCircle } from "lucide-react"
import { getDailySessionsMetrics } from "@/api/get-daily-sessions-metrics"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    count: {
        label: "Sessões",
        color: "#3b82f6",
    },
} satisfies ChartConfig

interface SessionsBarChartProps {
    startDate?: Date
    endDate?: Date
}

export function SessionsBarChart({ startDate: propStartDate, endDate: propEndDate }: SessionsBarChartProps) {
    const dateRange = useMemo(() => {
        const end = propEndDate ? endOfDay(propEndDate) : endOfDay(new Date())
        const start = propStartDate ? startOfDay(propStartDate) : startOfDay(subDays(end, 7))
        return { startDate: start, endDate: end }
    }, [propStartDate, propEndDate])

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["daily-sessions-bar", dateRange.startDate.toISOString(), dateRange.endDate.toISOString()],
        queryFn: () => getDailySessionsMetrics(dateRange.startDate.toISOString(), dateRange.endDate.toISOString()),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })

    const chartData = useMemo(() => data || [], [data])
    const totalSessions = useMemo(() => chartData.reduce((acc, d) => acc + d.count, 0), [chartData])
    const maxSessions = useMemo(() => Math.max(...chartData.map((d) => d.count), 0), [chartData])
    const yAxisMax = useMemo(() => Math.max(5, Math.ceil(maxSessions * 1.1)), [maxSessions])

    return (
        <Card className="col-span-6 border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-6 pb-2 pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Sessões Realizadas
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">
                            Volume diário de atendimentos concluídos
                        </span>
                    </div>

                    {!isLoading && !isError && chartData.length > 0 && (
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">{totalSessions}</span>
                            <span className="text-lg text-muted-foreground font-medium">Sessões</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-2">
                {isLoading ? (
                    <div className="flex h-[200px] items-end gap-4 pt-8">
                        {[...Array(7)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="w-full rounded-lg bg-slate-100"
                                style={{ height: `${30 + Math.random() * 50}%` }}
                            />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex h-[200px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <AlertCircle className="size-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Erro ao carregar sessões</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-2 text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                        >
                            <RefreshCcw size={12} /> Tentar novamente
                        </button>
                    </div>
                ) : chartData.length === 0 || chartData.every(d => d.count === 0) ? (
                    <div className="flex h-[200px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                            <CalendarOff className="h-5 w-5 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Nenhuma sessão</p>
                        <p className="mt-1 text-xs text-slate-400">Sem atendimentos neste período</p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart data={chartData} margin={{ top: 20, left: -25, right: 5, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                fontSize={12}
                                fontWeight={500}
                                stroke="#94a3b8"
                                tickFormatter={(value) => format(new Date(value), "EEE", { locale: ptBR })}
                            />

                            <YAxis
                                domain={[0, yAxisMax]}
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                fontWeight={500}
                                stroke="#cbd5e1"
                                allowDecimals={false}
                                tickCount={4}
                            />

                            <ChartTooltip
                                cursor={{ fill: "#f1f5f9", radius: 8 }}
                                content={
                                    <ChartTooltipContent
                                        className="border-0 shadow-lg bg-slate-900 text-white rounded-lg px-3 py-2"
                                        labelClassName="text-slate-300 text-xs"
                                        labelFormatter={(value) => format(new Date(value), "dd MMM, yyyy", { locale: ptBR })}
                                        formatter={(value) => (
                                            <div className="flex items-center gap-1.5 font-bold text-white">
                                                <span>{value}</span>
                                                <span className="text-xs font-normal text-slate-400">Sessões</span>
                                            </div>
                                        )}
                                    />
                                }
                            />

                            <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={32} animationDuration={800}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.count === maxSessions && maxSessions > 0 ? "#2563eb" : "#3b82f6"}
                                        className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}