"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import { format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { Users } from "lucide-react"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    newPatients: {
        label: "Pacientes",
        color: "hsl(217, 91%, 60%)",
    },
} satisfies ChartConfig

export function NewPatientsBarChart({
    startDate: propStartDate,
    endDate: propEndDate,
}: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = useMemo(() => {
        const end = propEndDate || new Date()
        const start = propStartDate || subDays(end, 7)
        return { startDate: start, endDate: end }
    }, [propStartDate, propEndDate])

    const { data, isLoading, isError } = useQuery({
        queryKey: ["new-patients-bar", startDate.toISOString(), endDate.toISOString()],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
        retry: 1,
    })

    const chartData = useMemo(() => data || [], [data])
    const maxPatients = useMemo(() => Math.max(...chartData.map((d) => d.newPatients), 0), [chartData])
    const yAxisMax = useMemo(() => Math.max(5, maxPatients + 1), [maxPatients])

    const totalPatients = useMemo(() => chartData.reduce((acc, d) => acc + d.newPatients, 0), [chartData])

    return (
        <Card className="col-span-6 border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-6 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Novos Pacientes
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">
                            Cadastros no período selecionado
                        </span>
                    </div>

                    {!isLoading && !isError && chartData.length > 0 && (
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">{totalPatients}</span>
                            <span className="text-lg text-muted-foreground">Pacientes</span>
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
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <span className="text-xl">!</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700">Erro ao carregar dados</p>
                        <p className="mt-1 text-xs text-slate-400">Tente novamente em instantes</p>
                    </div>
                ) : chartData.length === 0 || chartData.every((d) => d.newPatients === 0) ? (
                    <div className="flex h-[200px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                            <Users className="h-5 w-5 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Nenhum registro</p>
                        <p className="mt-1 text-xs text-slate-400">Não há pacientes neste período</p>
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
                                                <span className="text-xs font-normal text-slate-400">Pacientes</span>
                                            </div>
                                        )}
                                    />
                                }
                            />

                            <Bar dataKey="newPatients" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={32} animationDuration={800}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.newPatients === maxPatients ? "#2563eb" : "#3b82f6"}
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
