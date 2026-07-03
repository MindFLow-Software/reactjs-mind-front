import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { IAppointmentWithNames } from '@/types/appointment'
import { AppointmentStatus } from '@/types/enums'
import { useTodayAppointments } from '../hooks/use-today-appointments'
import { formatTime } from '../helpers'
import './today-agenda.css'

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
  appt: IAppointmentWithNames
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
    <div className="dsh-agenda-row">
      <div className="dsh-agenda-row-time">
        <p className="dsh-agenda-row-time-value">{time}</p>
        <p className="dsh-agenda-row-time-duration">{duration}</p>
      </div>

      <div className="dsh-agenda-row-main">
        <p className="dsh-agenda-row-name">{patientName}</p>
        {appt.diagnosis && (
          <p className="dsh-agenda-row-diagnosis">{appt.diagnosis}</p>
        )}
      </div>

      <span className={cn('dsh-agenda-row-status', status.className)}>
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
    <Card className="dsh-agenda-card">
      <CardHeader className="dsh-agenda-header">
        <div className="dsh-agenda-header-row">
          <div className="dsh-agenda-header-main">
            <div className="dsh-agenda-icon">
              <CalendarDays className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="dsh-agenda-title">Agenda de hoje</p>
              <p className="dsh-agenda-subtitle">
                {isLoading
                  ? '...'
                  : `${todayLabel} · ${todayAppointments.length} ${todayAppointments.length === 1 ? 'sessão' : 'sessões'}`}
              </p>
            </div>
          </div>
          <Link to="/appointments" className="dsh-agenda-link">
            Ver tudo
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="dsh-agenda-content">
        {isLoading ? (
          <div className="dsh-agenda-loading">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="dsh-agenda-loading-row">
                <Skeleton className="h-8 w-12" />
                <div className="dsh-agenda-loading-lines">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
            ))}
          </div>
        ) : todayAppointments.length === 0 ? (
          <div className="dsh-agenda-empty">
            <div className="dsh-agenda-empty-icon">
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
          <div className="dsh-agenda-list">
            {todayAppointments.map((appt) => (
              <AgendaRow key={appt.id} appt={appt} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
