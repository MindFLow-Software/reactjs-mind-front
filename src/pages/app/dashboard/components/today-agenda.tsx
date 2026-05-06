"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { format, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarDays, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { fetchAppointments } from "@/api/fetch-appointments"
import type { Appointment } from "@/api/fetch-appointments"
import { AppointmentStatus } from "@/types/appointment"

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    [AppointmentStatus.FINISHED]: {
        label: 'Concluída',
        className: 'bg-muted text-muted-foreground',
    },
    [AppointmentStatus.SCHEDULED]: {
        label: 'Confirmada',
        className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    [AppointmentStatus.ATTENDING]: {
        label: 'Em andamento',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    [AppointmentStatus.RESCHEDULED]: {
        label: 'Remarcada',
        className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    [AppointmentStatus.CANCELED]: {
        label: 'Cancelada',
        className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    [AppointmentStatus.NOT_ATTEND]: {
        label: 'Não compareceu',
        className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
}

function AgendaRow({ appt }: { appt: Appointment }) {
    const time = format(new Date(appt.scheduledAt), 'HH:mm')
    const duration = '50 min'
    const patientName = `${appt.patient.firstName} ${appt.patient.lastName}`
    const status = STATUS_CONFIG[appt.status] ?? { label: 'Aguardando', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }

    return (
        <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <div className="min-w-[52px]">
                <p className="text-sm font-semibold text-foreground tabular-nums">{time}</p>
                <p className="text-xs text-muted-foreground">{duration}</p>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{patientName}</p>
                {appt.diagnosis && (
                    <p className="text-xs text-muted-foreground truncate">{appt.diagnosis}</p>
                )}
            </div>

            <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-xs font-medium", status.className)}>
                {status.label}
            </span>
        </div>
    )
}

export function TodayAgenda() {
    const todayLabel = useMemo(
        () => format(new Date(), "d 'de' MMMM", { locale: ptBR }),
        []
    )

    const { data, isLoading } = useQuery({
        queryKey: ['dashboard', 'today-agenda'],
        queryFn: () => fetchAppointments({ perPage: 200, orderBy: 'asc' }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const todayAppointments = useMemo(() => {
        if (!data?.appointments) return []
        const todayStart = startOfDay(new Date())
        const todayEnd = endOfDay(new Date())
        return data.appointments
            .filter(a => {
                const d = new Date(a.scheduledAt)
                return d >= todayStart && d <= todayEnd
            })
            .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    }, [data])

    return (
        <Card className="border-border bg-card shadow-sm rounded-2xl flex flex-col h-full">
            <CardHeader className="pb-0 px-5 pt-5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground">Agenda de hoje</CardTitle>
                    <Link
                        to="/appointments"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Ver tudo
                        <ArrowRight className="size-3" />
                    </Link>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    {isLoading ? '...' : `${todayLabel} · ${todayAppointments.length} ${todayAppointments.length === 1 ? 'sessão' : 'sessões'}`}
                </p>
            </CardHeader>

            <CardContent className="flex-1 px-5 pt-3 pb-5">
                {isLoading ? (
                    <div className="space-y-3 pt-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 py-2">
                                <Skeleton className="h-8 w-12" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-3.5 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-5 w-20 rounded-md" />
                            </div>
                        ))}
                    </div>
                ) : todayAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
                            <CalendarDays className="size-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Nenhuma sessão hoje</p>
                        <p className="text-xs text-muted-foreground">Sua agenda está livre</p>
                    </div>
                ) : (
                    <div className="pt-1">
                        {todayAppointments.map(appt => (
                            <AgendaRow key={appt.id} appt={appt} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
