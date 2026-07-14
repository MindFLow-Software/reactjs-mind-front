import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { IDashboardAppointment } from '@/types/dashboard'
import { AppointmentStatus } from '@/types/appointment/appointment-status'
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
  appt: IDashboardAppointment
}

function AgendaRow({ appt }: AgendaRowProps) {
  const time = format(new Date(appt.scheduledAt), 'HH:mm')
  const duration =
    appt.durationInMin != null ? formatTime(appt.durationInMin) : '—'
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
        <p className="dsh-agenda-row-name">{appt.patientName}</p>
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

interface AgendaGroupProps {
  label: string
  appointments: IDashboardAppointment[]
  emptyMessage: string
}

function AgendaGroup({ label, appointments, emptyMessage }: AgendaGroupProps) {
  return (
    <div className="dsh-agenda-group">
      <p className="dsh-agenda-group-label">{label}</p>
      {appointments.length === 0 ? (
        <p className="dsh-agenda-group-empty">{emptyMessage}</p>
      ) : (
        <div className="dsh-agenda-list">
          {appointments.map((appt) => (
            <AgendaRow key={appt.id} appt={appt} />
          ))}
        </div>
      )}
    </div>
  )
}

interface TodayAgendaProps {
  today: IDashboardAppointment[]
  tomorrow: IDashboardAppointment[]
}

export function TodayAgenda({ today, tomorrow }: TodayAgendaProps) {
  const todayLabel = useMemo(
    () => format(new Date(), "d 'de' MMMM", { locale: ptBR }),
    [],
  )

  const hasNoAppointments = today.length === 0 && tomorrow.length === 0

  return (
    <Card className="dsh-agenda-card">
      <CardHeader className="dsh-agenda-header">
        <div className="dsh-agenda-header-row">
          <div className="dsh-agenda-header-main">
            <div className="dsh-agenda-icon">
              <CalendarDays className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="dsh-agenda-title">Agenda</p>
              <p className="dsh-agenda-subtitle">
                {todayLabel} · {today.length}{' '}
                {today.length === 1 ? 'sessão hoje' : 'sessões hoje'}
              </p>
            </div>
          </div>
          <Link to="/appointment" className="dsh-agenda-link">
            Ver tudo
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="dsh-agenda-content">
        {hasNoAppointments ? (
          <div className="dsh-agenda-empty">
            <div className="dsh-agenda-empty-icon">
              <CalendarDays className="size-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Nenhuma sessão agendada
            </p>
            <p className="text-xs text-muted-foreground">
              Sua agenda está livre para hoje e amanhã
            </p>
          </div>
        ) : (
          <div className="dsh-agenda-groups">
            <AgendaGroup
              label="Hoje"
              appointments={today}
              emptyMessage="Nenhuma sessão hoje"
            />
            <AgendaGroup
              label="Amanhã"
              appointments={tomorrow}
              emptyMessage="Nenhuma sessão amanhã"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
