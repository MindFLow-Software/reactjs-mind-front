"use client"

import { useMemo } from "react"
import { Goal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

interface MonthSessionData {
    total: number
}

const fetchMonthSessionsTotal = async (
    _startDate?: Date,
    _endDate?: Date,
): Promise<MonthSessionData> => {
    return { total: 58 }
}

interface MonthPatientsAmountCardProps {
    startDate: Date | undefined
    endDate: Date | undefined
}

export function MonthPatientsAmountCard({
    startDate,
    endDate,
}: MonthPatientsAmountCardProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: [
            "month-sessions-total",
            startDate?.toISOString(),
            endDate?.toISOString(),
        ],
        queryFn: () => fetchMonthSessionsTotal(startDate, endDate),
        staleTime: 1000 * 60 * 5,
    })

    const total = data?.total ?? null

    const { displayValue, diffSign, formattedDiff, diffColorClass } =
        useMemo(() => {
            if (total === null) {
                return {
                    displayValue: "—",
                    diffSign: "",
                    formattedDiff: 0,
                    diffColorClass: "text-purple-600",
                }
            }

            const diff = 0.12
            const formattedDiff = diff * 100

            return {
                displayValue: total,
                diffSign: formattedDiff >= 0 ? "+" : "",
                formattedDiff,
                diffColorClass:
                    formattedDiff >= 0 ? "text-purple-600" : "text-red-500",
            }
        }, [total])

    return (
        <div
            className={cn(
                "relative overflow-hidden",
                "rounded-2xl",
                "border-b-4 border-b-purple-500",
                "shadow-lg shadow-black/10",
                "p-5",
                "bg-linear-to-br from-purple-100 via-purple-50 to-violet-100",
            )}
        >
            <img
                src="/goal.svg"
                alt="Mascote"
                className={cn(
                    "absolute bottom-0 right-0",
                    "w-3xl h-auto max-w-[130px]",
                    "opacity-80",
                    "pointer-events-none",
                    "translate-x-1/4 translate-y-1/4",
                )}
            />

            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-purple-200/80 p-2.5 w-fit">
                        <Goal className="size-5 text-purple-700" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-8 w-20 rounded bg-purple-200/50 animate-pulse" />
                        <div className="h-4 w-36 rounded bg-purple-200/50 animate-pulse" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-red-500">
                            Erro ao carregar
                        </span>
                        <span className="text-xs text-purple-700/70">
                            Tente novamente
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-bold tracking-tight text-purple-950">
                            {typeof displayValue === "number"
                                ? displayValue.toLocaleString("pt-BR")
                                : displayValue}
                        </span>

                        <p className="text-sm font-medium text-purple-900">
                            Sessões realizadas no mês
                        </p>

                        <p className="text-xs text-purple-800/80">
                            <span className={cn("font-semibold", diffColorClass)}>
                                {diffSign}
                                {formattedDiff.toFixed(1)}%
                            </span>{" "}
                            em relação ao mês anterior
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
