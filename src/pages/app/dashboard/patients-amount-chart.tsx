"use client"

import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, subDays } from "date-fns"
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

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"

const chartConfig = {
    newPatients: {
        label: "Novos Pacientes",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function NewPatientsBarChart() {
    const { startDate, endDate } = useMemo(() => {
        const end = new Date()
        const start = subDays(end, 7)
        return { startDate: start, endDate: end }
    }, [])

    const { data, isLoading, isError } = useQuery({
        queryKey: ["new-patients-bar", startDate.toISOString(), endDate.toISOString()],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
        retry: 1,
    })

    if (isLoading) {
        return (
            <Card className="col-span-6 flex h-[250px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </Card>
        )
    }

    if (isError || !data) {
        return (
            <Card className="col-span-6 flex h-[250px] items-center justify-center text-muted-foreground">
                Erro ao carregar dados do gráfico
            </Card>
        )
    }

    const maxPatients = Math.max(...data.map(d => d.newPatients), 0)
    const yAxisMax = Math.max(10, maxPatients + Math.ceil(maxPatients * 0.2))

    return (
        <Card className={cn("col-span-6 py-0")}>
            <CardHeader className="px-6 pt-5 pb-3">
                <CardTitle className="text-base font-medium">
                    Novos Pacientes por Dia
                </CardTitle>
                <CardDescription>
                    Quantidade diária de novos pacientes cadastrados
                </CardDescription>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />

                        <YAxis
                            domain={[0, yAxisMax]}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={24}
                            tickFormatter={(value) =>
                                format(new Date(value), "dd/MM", { locale: ptBR })
                            }
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[140px]"
                                    nameKey="newPatients"
                                    labelFormatter={(value) =>
                                        format(new Date(value), "dd 'de' MMMM 'de' yyyy", {
                                            locale: ptBR,
                                        })
                                    }
                                />
                            }
                        />

                        <Bar
                            dataKey="newPatients"
                            fill="var(--chart-1)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
