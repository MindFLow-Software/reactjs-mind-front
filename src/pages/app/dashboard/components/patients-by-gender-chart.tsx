"use client"

import * as React from "react"
import { Cell, Label, Pie, PieChart } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { subDays, startOfDay, endOfDay } from "date-fns"
import { Loader2, Users, AlertCircle, RefreshCcw } from "lucide-react"

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
import { getPatientsByGender } from "@/api/get-patients-by-gender"
import type { DashboardPeriod } from "./dashboard-header"

const GENDER_TRANSLATIONS: Record<string, string> = {
    FEMININE: "Feminino",
    MASCULINE: "Masculino",
    OTHER: "Outros",
}

// Feminino → rosa, Masculino → azul, Outros → roxo
const GENDER_COLORS: Record<string, string> = {
    Feminino: "#ec4899",
    Masculino: "#3b82f6",
    Outros: "#a855f7",
}
const CHART_COLORS = ["#ec4899", "#3b82f6", "#a855f7"]

const chartConfig = {
    patients: { label: "Pacientes" },
} satisfies ChartConfig

const PERIOD_DAYS: Record<DashboardPeriod, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    'year': 365,
}

interface PatientsByGenderChartProps {
    period: DashboardPeriod
}

export const PatientsByGenderChart = React.memo(function PatientsByGenderChart({ period }: PatientsByGenderChartProps) {
    const { startDateToFetch, endDateToFetch } = React.useMemo(() => {
        const ref = new Date()
        const days = PERIOD_DAYS[period]
        return {
            startDateToFetch: startOfDay(subDays(ref, days)),
            endDateToFetch: endOfDay(ref),
        }
    }, [period])

    const { data: rawData, isLoading, isError, refetch } = useQuery({
        queryKey: ['dashboard', 'gender-stats', startDateToFetch, endDateToFetch],
        queryFn: () => getPatientsByGender({
            startDate: startDateToFetch.toISOString(),
            endDate: endDateToFetch.toISOString()
        }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const { chartData, totalPatients, isEmpty } = React.useMemo(() => {
        if (!rawData) return { chartData: [], totalPatients: 0, isEmpty: true }
        const translated = rawData.map(item => ({
            ...item,
            gender: GENDER_TRANSLATIONS[item.gender] || item.gender,
        }))
        const total = translated.reduce((sum, item) => sum + item.patients, 0)
        return {
            chartData: translated,
            totalPatients: total,
            isEmpty: translated.length === 0 || total === 0
        }
    }, [rawData])

    return (
        <Card className="border-border bg-card shadow-sm rounded-2xl flex flex-col">
            <CardHeader className="px-6 pt-5 pb-4">
                <CardTitle className="text-base font-semibold text-foreground">Perfil dos pacientes</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Por gênero</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 px-6 pb-6">
                {isLoading ? (
                    <div className="flex h-[180px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : isError ? (
                    <div className="flex h-[180px] flex-col items-center justify-center gap-2 text-center">
                        <AlertCircle className="size-5 text-red-500" />
                        <p className="text-sm text-red-500">Erro ao carregar</p>
                        <button onClick={() => refetch()} className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline">
                            <RefreshCcw size={12} /> Tentar novamente
                        </button>
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-[180px] flex-col items-center justify-center gap-2 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30">
                            <Users className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Sem dados de gênero</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <ChartContainer config={chartConfig} className="h-[160px] w-[160px] shrink-0">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={chartData}
                                    dataKey="patients"
                                    nameKey="gender"
                                    innerRadius={52}
                                    outerRadius={72}
                                    strokeWidth={4}
                                    stroke="var(--card)"
                                    paddingAngle={3}
                                >
                                    {chartData.map((item, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={GENDER_COLORS[item.gender] ?? CHART_COLORS[index % CHART_COLORS.length]}
                                            className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                        />
                                    ))}
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) - 8}
                                                            fontSize={22}
                                                            fontWeight={700}
                                                            fill="currentColor"
                                                        >
                                                            {totalPatients}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 12}
                                                            fontSize={11}
                                                            fill="currentColor"
                                                            opacity={0.6}
                                                        >
                                                            pacientes
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>

                        <div className="flex flex-col gap-3 flex-1">
                            {chartData.map((item, index) => {
                                const percentage = ((item.patients / totalPatients) * 100).toFixed(0)
                                return (
                                    <div key={item.gender} className="flex items-center gap-2.5">
                                        <div
                                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                                            style={{ backgroundColor: GENDER_COLORS[item.gender] ?? CHART_COLORS[index % CHART_COLORS.length] }}
                                        />
                                        <span className="text-sm text-muted-foreground flex-1">{item.gender}</span>
                                        <span className="text-sm font-semibold text-foreground tabular-nums">{percentage}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
})
