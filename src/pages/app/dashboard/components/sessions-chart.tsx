"use client"

import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useMemo } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { Loader2, AlertCircle, CalendarOff } from "lucide-react"
import { getDailySessionsMetrics } from "@/api/get-daily-sessions-metrics"

const chartConfig = {
    count: {
        label: "Sessões",
        color: "var(--chart-1)",
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

        return {
            startDate: start,
            endDate: end
        }
    }, [propStartDate, propEndDate])

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["daily-sessions-bar", dateRange.startDate.toISOString(), dateRange.endDate.toISOString()],
        queryFn: () => getDailySessionsMetrics(dateRange.startDate.toISOString(), dateRange.endDate.toISOString()),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })

    const chartData = useMemo(() => data || [], [data])

    // Verifica se não há dados ou se todas as contagens são zero
    const isEmpty = useMemo(() => {
        return chartData.length === 0 || chartData.every(d => d.count === 0)
    }, [chartData])

    const yAxisMax = useMemo(() => {
        const max = Math.max(...chartData.map(d => d.count), 0)
        return max < 10 ? 10 : Math.ceil(max * 1.2)
    }, [chartData])

    if (isLoading) {
        return (
            <Card className="col-span-6 flex h-[300px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="col-span-6 flex h-[300px] flex-col items-center justify-center gap-2 text-red-500 font-medium">
                <AlertCircle className="h-6 w-6" />
                <span>Erro ao carregar sessões</span>
                <button
                    onClick={() => refetch()}
                    className="text-xs underline text-muted-foreground hover:text-red-400"
                >
                    Tentar novamente
                </button>
            </Card>
        )
    }

    // ESTADO VAZIO (IGUAL AO SEU EXEMPLO)
    if (isEmpty) {
        return (
            <Card className="col-span-6 flex h-[300px] flex-col items-center justify-center gap-2 text-muted-foreground border-dashed">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <CalendarOff className="h-6 w-6 opacity-50" />
                </div>
                <div className="text-center space-y-1">
                    <p className="font-medium">Nenhuma sessão encontrada</p>
                    <p className="text-sm text-muted-foreground">Não houveram atendimentos concluídos neste período.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="col-span-6 py-0">
            <CardHeader className="px-6 pt-5 pb-3">
                <CardTitle className="text-base font-medium">
                    Sessões Realizadas
                </CardTitle>
                <CardDescription>
                    Quantidade diária de atendimentos concluídos
                </CardDescription>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />

                        <YAxis
                            domain={[0, yAxisMax]}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                            allowDecimals={false}
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={20}
                            tickFormatter={(value) =>
                                format(new Date(value), "dd/MM", { locale: ptBR })
                            }
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-40"
                                    nameKey="count"
                                    labelFormatter={(value) =>
                                        format(new Date(value), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                    }
                                />
                            }
                        />

                        <Bar
                            dataKey="count"
                            fill="var(--chart-1)"
                            radius={[4, 4, 0, 0]}
                            name="Sessões"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}