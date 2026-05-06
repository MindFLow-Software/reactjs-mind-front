"use client"

import { memo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Clock, Minus, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getTotalWorkHours } from "@/api/get-total-work-hours"
import { cn } from "@/lib/utils"

const MONTHLY_GOAL_HOURS = 80

interface TotalWorkHoursCardProps {
    startDate?: Date
    endDate?: Date
}

function formatTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
}

export const TotalWorkHoursCard = memo(function TotalWorkHoursCard({
    startDate,
    endDate,
}: TotalWorkHoursCardProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['dashboard', 'work-hours', startDate?.toISOString(), endDate?.toISOString()],
        queryFn: () => getTotalWorkHours(startDate, endDate),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const hoursWorked = data ? data.totalMinutes / 60 : 0
    const progressPct = Math.min((hoursWorked / MONTHLY_GOAL_HOURS) * 100, 100)
    const atGoal = hoursWorked >= MONTHLY_GOAL_HOURS

    return (
        <Card className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-emerald-400 to-emerald-600" />
            <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">Horas atendidas</p>
                <div className="rounded-lg bg-emerald-500/10 p-2 ring-1 ring-emerald-500/20">
                    <Clock className="size-4 text-emerald-500" />
                </div>
            </div>

            {isLoading ? (
                <div className="mt-3 space-y-2">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-5 w-44" />
                </div>
            ) : isError ? (
                <div className="mt-3 flex items-center gap-2 text-red-500">
                    <AlertCircle className="size-4" />
                    <span className="text-sm">Erro ao carregar</span>
                </div>
            ) : (
                <div className="mt-3">
                    <p className="text-4xl font-bold tabular-nums text-foreground">
                        {data ? formatTime(data.totalMinutes) : '0h'}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                        <Minus className={cn("size-3", atGoal ? "text-green-500" : "text-muted-foreground")} />
                        <span className="text-xs text-muted-foreground">
                            meta mensal: {MONTHLY_GOAL_HOURS}h
                        </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={cn("h-full rounded-full transition-all", atGoal ? "bg-emerald-500" : "bg-emerald-400")}
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>
            )}
        </Card>
    )
})
