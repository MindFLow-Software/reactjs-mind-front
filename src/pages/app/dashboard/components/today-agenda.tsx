import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Appointment } from '@/types/appointment'
import { AppointmentStatus } from '@/types/appointment'
import { useTodayAppointments } from '../hooks/use-today-appointments'
import { formatTime } from '../helpers'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  [AppointmentStatus.FINISHED]: {
    label: 'Concluída',
    className: 'bg-muted text-muted-foreground',
  },
  [AppointmentStatus.SCHEDULED]: {
    label: 'Confirmada',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  [AppointmentStatus.ATTENDING]: {
    label: 'Em andamento',
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  [AppointmentStatus.RESCHEDULED]: {
    label: 'Remarcada',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
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

interface AgendaRowProps {
  appt: Appointment
}

function AgendaRow({ appt }: AgendaRowProps) {
  const time = format(new Date(appt.scheduledAt), 'HH:mm')
  const duration =
    appt.durationInMin != null ? formatTime(appt.durationInMin) : '—'
  const patientName = appt.patient
    ? `${appt.patient.firstName} ${appt.patient.lastName}`
    : 'Paciente não informado'
  const status = STATUS_CONFIG[appt.status] ?? {
    label: 'Aguardando',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="min-w-[52px]">
        <p className="text-sm font-semibold text-foreground tabular-nums">
          {time}
        </p>
        <p className="text-xs text-muted-foreground">{duration}</p>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {patientName}
        </p>
        {appt.diagnosis && (
          <p className="text-xs text-muted-foreground truncate">
            {appt.diagnosis}
          </p>
        )}
      </div>

      <span
        className={cn(
          'shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
          status.className,
        )}
      >
        {status.label}
      </span>
    </div>
  )
}

export function TodayAgenda() {
  const todayLabel = useMemo(
    () => format(new Date(), "d 'de' MMMM", { locale: ptBR }),
    [],
  )

  const { appointments: todayAppointments, isLoading } = useTodayAppointments()

  return (
    <Card className="border-border bg-card shadow-sm rounded-xl flex flex-col h-full">
      <CardHeader className="pb-4 px-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
              <CalendarDays className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground leading-tight">
                Agenda de hoje
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isLoading
                  ? '...'
                  : `${todayLabel} · ${todayAppointments.length} ${todayAppointments.length === 1 ? 'sessão' : 'sessões'}`}
              </p>
            </div>
          </div>
          <Link
            to="/appointments"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Ver tudo
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-5 pt-4 pb-5">
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
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30">
              <CalendarDays className="size-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Nenhuma sessão hoje
            </p>
            <p className="text-xs text-muted-foreground">
              Sua agenda está livre
            </p>
          </div>
        ) : (
          <div className="pt-1">
            {todayAppointments.map((appt) => (
              <AgendaRow key={appt.id} appt={appt} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
