"use client"

import { useQuery } from "@tanstack/react-query"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import colors from "tailwindcss/colors"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo } from "react"
import { Loader2, AlertCircle, Mars, PieChart as PieChartIcon } from "lucide-react"

import { getPatientsByGender, type PatientsByGenderResponse } from "@/api/get-patients-by-gender"

const GENDER_TRANSLATIONS: Record<string, string> = {
    FEMININE: "Feminino",
    MASCULINE: "Masculino",
    OTHER: "Outros",
}

const COLORS = [
    colors.fuchsia[500],
    colors.blue[500],
    colors.emerald[500],
    colors.sky[400],
    colors.amber[400],
    colors.rose[400],
]

function CustomTooltip({ active, payload, total }: any) {
    if (active && payload && payload.length && total > 0) {
        const data = payload[0]
        const percentage = ((data.value / total) * 100).toFixed(1)

        return (
            <div className="rounded-lg border bg-background p-3 shadow-lg">
                <p className="font-medium text-sm mb-1">{data.name}</p>
                <p className="text-sm text-muted-foreground">
                    {data.value} pacientes ({percentage}%)
                </p>
            </div>
        )
    }
    return null
}

interface PatientsByGenderChartProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export function PatientsByGenderChart({ startDate, endDate }: PatientsByGenderChartProps) {
    const startIso = startDate?.toISOString()
    const endIso = endDate?.toISOString()

    const { data: rawData, isLoading, isError, refetch } = useQuery<PatientsByGenderResponse[]>({
        queryKey: ['dashboard', 'gender-stats', startIso, endIso],
        queryFn: () => getPatientsByGender({ startDate: startIso, endDate: endIso }),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })

    const chartData = useMemo(() => {
        if (!rawData) return []
        return rawData.map(item => ({
            ...item,
            gender: GENDER_TRANSLATIONS[item.gender] || item.gender,
        }))
    }, [rawData])

    const totalPatients = useMemo(
        () => chartData.reduce((sum, item) => sum + item.patients, 0),
        [chartData]
    )

    const isEmpty = useMemo(() => {
        return chartData.length === 0 || totalPatients === 0
    }, [chartData, totalPatients])

    if (isLoading) {
        return (
            <Card className="col-span-1 flex h-[440px] items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="col-span-1 flex h-[440px] flex-col items-center justify-center gap-2 text-red-500 font-medium px-6 text-center">
                <AlertCircle className="size-6" />
                <span>Erro ao carregar gêneros</span>
                <button
                    onClick={() => refetch()}
                    className="text-xs underline text-muted-foreground hover:text-red-400"
                >
                    Tentar novamente
                </button>
            </Card>
        )
    }

    if (isEmpty) {
        return (
            <Card className="col-span-1 flex h-[440px] flex-col items-center justify-center gap-3 text-muted-foreground border-dashed">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Mars className="h-6 w-6 opacity-50" />
                </div>
                <div className="text-center space-y-1 px-6">
                    <p className="font-medium">Sem dados de gênero</p>
                    <p className="text-sm text-muted-foreground">
                        Nenhum paciente com gênero definido neste período.
                    </p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="col-span-1 flex flex-col">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Distribuição por Gênero</CardTitle>
                    <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                    Total de {totalPatients} pacientes no período
                </p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div className="flex-1 min-h-[240px]">
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                nameKey="gender"
                                dataKey="patients"
                                cx="50%"
                                cy="50%"
                                outerRadius={86}
                                innerRadius={64}
                                strokeWidth={8}
                                labelLine={false}
                                animationBegin={0}
                                animationDuration={800}
                                animationEasing="ease-out"
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        className="stroke-background hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip total={totalPatients} />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-4 border-t">
                    {chartData.map((item, index) => {
                        const percentage = ((item.patients / totalPatients) * 100).toFixed(1)
                        return (
                            <div key={item.gender} className="flex items-center space-x-2">
                                <div
                                    className="h-2 w-2 rounded-full shrink-0"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-xs font-medium text-foreground whitespace-nowrap">
                                    {item.gender}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ({percentage}%)
                                </span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}