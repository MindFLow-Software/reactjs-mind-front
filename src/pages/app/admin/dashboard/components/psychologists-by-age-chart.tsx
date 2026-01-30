"use client"

import * as React from "react"
import { Cell, Pie, PieChart } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Users2, AlertCircle, RefreshCcw } from "lucide-react"

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
import { api } from "@/lib/axios"

interface AgeStats {
    ageRange: string
    count: number
}

async function getPsychologistsAgeStats(): Promise<AgeStats[]> {
    const response = await api.get<AgeStats[]>("/admin/metrics/psychologists/age-range")
    return response.data
}

const chartConfig = {
    psychologists: {
        label: "Psicólogos",
    },
} satisfies ChartConfig

const CHART_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
]

export function PsychologistsAgeRangeChart() {
    const { data, isLoading, isError, refetch } = useQuery<AgeStats[]>({
        queryKey: ['admin', 'psychologists-age-stats'],
        queryFn: getPsychologistsAgeStats,
        staleTime: 1000 * 60 * 5,
    })

    const { totalPsychologists, isEmpty } = React.useMemo(() => {
        const total = data?.reduce((sum, item) => sum + item.count, 0) ?? 0
        return {
            totalPsychologists: total,
            isEmpty: !data || data.length === 0 || total === 0
        }
    }, [data])

    return (
        <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-border p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4">
                    <CardTitle className="text-base font-semibold uppercase tracking-wider text-foreground">
                        Perfil Etário
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Distribuição dos psicólogos ativos
                    </CardDescription>
                </div>
                <div className="flex border-t border-border sm:border-t-0 sm:border-l">
                    <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Total Geral
                        </span>
                        <span className="text-xl font-bold leading-none sm:text-2xl text-foreground">
                            {totalPsychologists.toLocaleString()}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pt-6 pb-6 flex-1 flex flex-col bg-card">
                {isLoading ? (
                    <div className="flex h-[300px] w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : isError ? (
                    <div className="flex h-[300px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                            <AlertCircle className="size-6" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Erro ao carregar dados</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-2 text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                            <RefreshCcw size={12} /> Tentar novamente
                        </button>
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-[300px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
                            <Users2 className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Sem dados demográficos</p>
                        <p className="mt-1 text-xs text-muted-foreground">Nenhum psicólogo cadastrado no sistema</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 min-h-[250px] flex items-center justify-center">
                            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px] w-full">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Pie
                                        data={data}
                                        dataKey="count"
                                        nameKey="ageRange"
                                        innerRadius={70}
                                        outerRadius={90}
                                        strokeWidth={5}
                                        stroke="var(--card)"
                                        paddingAngle={2}
                                    >
                                        {data?.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-6 border-t border-border mt-6">
                            {data?.map((item, index) => {
                                const percentage = ((item.count / totalPsychologists) * 100).toFixed(1)
                                return (
                                    <div key={item.ageRange} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-2.5">
                                            <div
                                                className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                            />
                                            <span className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                                                {item.ageRange}
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-bold tabular-nums text-foreground">
                                            {percentage}%
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}