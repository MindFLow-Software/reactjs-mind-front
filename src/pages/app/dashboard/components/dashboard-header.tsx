"use client"

import { useMemo } from "react"
import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { usePsychologistProfile } from "@/hooks/use-psychologist-profile"
import { fetchAppointments } from "@/api/fetch-appointments"

export type DashboardPeriod = '7d' | '30d' | '90d' | 'year'

interface DashboardHeaderProps {
    period: DashboardPeriod
    onPeriodChange: (p: DashboardPeriod) => void
}

const PERIODS: { value: DashboardPeriod; label: string }[] = [
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' },
    { value: 'year', label: 'Ano' },
]

function getGreeting() {
    const h = new Date().getHours()
    if (h >= 5 && h < 12) return 'Bom dia'
    if (h >= 12 && h < 18) return 'Boa tarde'
    return 'Boa noite'
}

export function DashboardHeader({ period, onPeriodChange }: DashboardHeaderProps) {
    const { data: profile } = usePsychologistProfile()

    const formattedDate = useMemo(
        () => format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }),
        []
    )

    const { data: apptData } = useQuery({
        queryKey: ['dashboard', 'today-count'],
        queryFn: () => fetchAppointments({ perPage: 200 }),
        staleTime: 5 * 60 * 1000,
    })

    const todayCount = useMemo(() => {
        if (!apptData?.appointments) return 0
        return apptData.appointments.filter(a => isToday(new Date(a.scheduledAt))).length
    }, [apptData])

    const title = profile?.gender === 'FEMININE' ? 'Dra.' : 'Dr.'
    const name = profile ? `${title} ${profile.firstName} ${profile.lastName}` : ''

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    {getGreeting()}{name ? `, ${name}` : ''}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground capitalize">
                    {formattedDate}
                    {todayCount > 0 && ` · ${todayCount} ${todayCount === 1 ? 'sessão hoje' : 'sessões hoje'}`}
                </p>
            </div>

            <div className="flex items-center gap-1 self-start rounded-lg border border-border bg-muted/30 p-1">
                {PERIODS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => onPeriodChange(value)}
                        className={cn(
                            "rounded-md px-3 py-1.5 text-sm font-medium transition-all cursor-pointer",
                            period === value
                                ? "bg-blue-700 text-background shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    )
}
