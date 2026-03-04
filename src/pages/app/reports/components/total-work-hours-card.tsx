"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Clock, AlertCircle } from "lucide-react"
import { getTotalWorkHours } from "@/api/get-total-work-hours"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface TotalWorkHoursCardProps {
    startDate?: Date
    endDate?: Date
}

const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
}

export const TotalWorkHoursCard = ({ startDate, endDate }: TotalWorkHoursCardProps) => {
    const [state, setState] = useState({
        totalMinutes: null as number | null,
        isLoading: true,
        isError: false,
    })

    useEffect(() => {
        setState(prev => ({ ...prev, isLoading: true }))

        getTotalWorkHours(startDate, endDate)
            .then((data) =>
                setState({
                    totalMinutes: data.totalMinutes,
                    isLoading: false,
                    isError: false,
                })
            )
            .catch(() =>
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    isError: true,
                }))
            )
    }, [startDate, endDate])

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "rounded-xl border bg-card shadow-sm",
                "p-4 transition-all duration-300 hover:shadow-md",
                "border-l-4 border-accent-red"
            )}
        >
            <div className="relative z-10 flex flex-col">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#751b1b]/10 p-2 border border-[#751b1b]/20">
                            <Clock className="size-4 text-[#751b1b]" />
                        </div>
                        <div className="flex flex-col">
                            <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                Horas de Atendimento
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                Horas realizadas
                            </CardDescription>
                        </div>
                    </div>
                </div>

                {/* AJUSTE: Div substitui o Separator para garantir que toque as bordas */}
                <div
                    className="h-0 -mx-4 my-4 w-[calc(100%+2rem)] border-t-2 border-dashed border-muted-foreground/30"
                    aria-hidden="true"
                />

                {state.isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                ) : state.isError ? (
                    <div className="flex items-center gap-2 text-red-500 py-2">
                        <AlertCircle className="size-4" />
                        <span className="text-sm font-medium">
                            Erro ao carregar dados
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold tracking-tight tabular-nums">
                                {state.totalMinutes !== null
                                    ? formatTime(state.totalMinutes)
                                    : "0m"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}