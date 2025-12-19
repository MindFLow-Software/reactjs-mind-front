"use client"

import { TrendingUp } from "lucide-react"
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

    const {
        data: chartData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["dashboard", "patients-count-summary", startDate.toISOString(), endDate.toISOString()],
        queryFn: () => getAmountPatientsChart({ startDate, endDate }),
    })

    const { totalPatients, formattedDiff, diffSign, diffColorClass } = useMemo(() => {
        if (!chartData?.length) {
            return {
                totalPatients: 0,
                formattedDiff: 0,
                diffSign: "",
                diffColorClass: "text-emerald-600",
            }
        }

        const total = chartData.reduce((sum, item) => sum + item.newPatients, 0)

        const diff = 0.15 // mock
        const formatted = diff * 100
        const sign = formatted >= 0 ? "+" : ""
        const colorClass = formatted >= 0 ? "text-emerald-600" : "text-red-500"

        return {
            totalPatients: total,
            formattedDiff: formatted,
            diffSign: sign,
            diffColorClass: colorClass,
        }
    }, [chartData])

    return (
        <div
            className={cn(
                "relative overflow-hidden",
                "rounded-2xl",
                "border-b-4 border-b-emerald-600",
                "shadow-lg shadow-black/10",
                "p-5",
                "bg-linear-to-br from-emerald-100 via-emerald-50 to-green-100",
            )}
        >
            <img
                src="/brain.png"
                alt="Mascote cérebro"
                className={cn(
                    "absolute bottom-0 right-0",
                    "w-3xl h-auto max-w-[220px]",
                    "opacity-90",
                    "pointer-events-none",
                    "translate-x-1/4 translate-y-1/4"
                )} />

            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-emerald-200/80 p-2.5 w-fit">
                        <TrendingUp className="size-5 text-emerald-700" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-8 w-20 rounded bg-emerald-200/50 animate-pulse" />
                        <div className="h-4 w-36 rounded bg-emerald-200/50 animate-pulse" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-red-500">Erro ao carregar</span>
                        <span className="text-xs text-emerald-700/70">Tente novamente</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-bold tracking-tight text-emerald-950">
                            {totalPatients.toLocaleString("pt-BR")}
                        </span>

                        <p className="text-sm text-emerald-900 font-medium">Novos pacientes</p>

                        {totalPatients === 0 ? (
                            <p className="text-xs text-emerald-700/70">Nenhum paciente cadastrado neste período.</p>
                        ) : (
                            <p className="text-xs text-emerald-800/80">
                                <span className={cn("font-semibold", diffColorClass)}>
                                    {diffSign}
                                    {formattedDiff.toFixed(1)}%
                                </span>{" "}
                                em relação ao período anterior
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
