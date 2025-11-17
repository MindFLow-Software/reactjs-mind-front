import { Users2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { subDays } from "date-fns"
import { useMemo } from "react"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart" 

interface PatientsCountCardProps {
    startDate?: Date
    endDate?: Date
}

export const PatientsCountCard = ({ startDate: propStartDate, endDate: propEndDate }: PatientsCountCardProps) => {
    const endDate = propEndDate || new Date()
    const startDate = propStartDate || subDays(endDate, 30)

    const { data: chartData, isLoading, isError } = useQuery({
        queryKey: ['dashboard', 'patients-count-summary', startDate.toISOString(), endDate.toISOString()],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
    })

    const { totalPatients, formattedDiff, diffSign, diffColorClass } = useMemo(() => {
        if (!chartData?.length) {
            return {
                totalPatients: 0,
                diffValue: 0,
                formattedDiff: 0,
                diffSign: '',
                diffColorClass: 'text-emerald-500 dark:text-emerald-400'
            }
        }

        const total = chartData.reduce((sum, item) => sum + item.newPatients, 0)
        const diff = 0.05
        const formatted = diff * 100
        const sign = formatted >= 0 ? '+' : ''
        const colorClass = formatted >= 0 
            ? 'text-emerald-500 dark:text-emerald-400' 
            : 'text-red-500 dark:text-red-400'

        return {
            totalPatients: total,
            diffValue: diff,
            formattedDiff: formatted,
            diffSign: sign,
            diffColorClass: colorClass
        }
    }, [chartData])

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-3 sm:pb-2">
                <CardTitle className="flex items-center justify-between text-sm sm:text-base font-semibold">
                    <span className="leading-tight">Novos Pacientes (Período)</span>
                    <Users2 className="size-4 sm:size-6 text-blue-600 dark:text-blue-500 shrink-0" /> 
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                ) : isError ? (
                    <span className="text-sm text-red-500">Erro ao carregar</span>
                ) : (
                    <>
                        <span className="text-xl sm:text-2xl font-bold tracking-tight">
                            {totalPatients.toLocaleString('pt-BR')}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            <span className={diffColorClass}>{diffSign}{formattedDiff.toFixed(1)}%</span> em relação ao período passado
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
