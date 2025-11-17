import { TrendingUp } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { subDays } from "date-fns"
import { useMemo } from "react"
import { getAmountPatientsChart } from "@/api/get-amount-patients-chart"
import { cn } from "@/lib/utils"

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
        <Card className={cn(
            "relative overflow-hidden",
            "rounded-2xl",
            "border border-border border-b-[3px]",
            "shadow-sm shadow-black/8",
        )}>
            <div
                className={cn(
                    "absolute -top-16 -right-16",
                    "w-48 h-48",
                    "rounded-full",
                    "bg-linear-to-br from-emerald-400/70 to-emerald-800/7F0",
                    "blur-3xl opacity-60",
                    "pointer-events-none"
                )}
            />

            <div className="relative z-1 p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-emerald-100 dark:bg-emerald-950/40 p-2.5">
                            <TrendingUp className="size-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-1.5">
                        <div className="h-7 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-red-500">Erro ao carregar</span>
                        <span className="text-xs text-muted-foreground">Tente novamente</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight">
                                {totalPatients.toLocaleString('pt-BR')}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">
                                Novos Pacientes
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                <span className={cn("font-semibold", diffColorClass)}>
                                    {diffSign}{formattedDiff.toFixed(1)}%
                                </span>
                                {' em relação ao período passado'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}