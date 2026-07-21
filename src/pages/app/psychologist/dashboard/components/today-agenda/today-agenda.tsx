import { useMemo } from 'react'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { IconBadge, IconBadgeTone } from '@/components/icon-badge/icon-badge'
import { cn } from '@/lib/utils'
import { Time } from '@/utils/time'
import type { IDashboardAppointment } from '@/types/dashboard/dashboard-appointment'
import { AppointmentStatus } from '@/types/appointment/appointment-status'
import { formatTime } from '@/pages/app/dashboard/shared/helpers'
import './today-agenda.css'

type IAgendaStatusConfig = {
  label: string
  className: string
}

const STATUS_CONFIG: Record<string, IAgendaStatusConfig> = {
  [AppointmentStatus.FINISHED]: {
    label: 'Concluída',
    className: 'bg-muted text-muted-foreground',
  },
  [AppointmentStatus.SCHEDULED]: {
    label: 'Confirmada',
    className: 'bg-success/10 text-success dark:bg-success/20',
  },
  [AppointmentStatus.ATTENDING]: {
    label: 'Em andamento',
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  [AppointmentStatus.RESCHEDULED]: {
    label: 'Remarcada',
    className: 'bg-warning/10 text-warning dark:bg-warning/20',
  },
  [AppointmentStatus.CANCELED]: {
    label: 'Cancelada',
    className: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
  },
  [AppointmentStatus.NOT_ATTEND]: {
    label: 'Não compareceu',
    className: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
  },
}

type IAgendaRow = {
  appt: IDashboardAppointment
}

function AgendaRow({ appt }: IAgendaRow) {
  const time = Time.toHourMinute(appt.scheduledAt)
  const duration =
    appt.durationInMin != null ? formatTime(appt.durationInMin) : '—'
  const status = STATUS_CONFIG[appt.status] ?? {
    label: 'Aguardando',
    className: 'bg-warning/10 text-warning dark:bg-warning/20',
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

type IAgendaGroup = {
  label: string
  appointments: IDashboardAppointment[]
  emptyMessage: string
}

function AgendaGroup({ label, appointments, emptyMessage }: IAgendaGroup) {
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

type ITodayAgenda = {
  today: IDashboardAppointment[]
  tomorrow: IDashboardAppointment[]
}

export function TodayAgenda({ today, tomorrow }: ITodayAgenda) {
  const todayLabel = useMemo(() => Time.toDayLongMonth(new Date()), [])

  const hasNoAppointments = today.length === 0 && tomorrow.length === 0

  return (
    <Card className="dsh-agenda-card">
      <CardHeader className="dsh-agenda-header">
        <div className="dsh-agenda-header-row">
          <div className="dsh-agenda-header-main">
            <IconBadge tone={IconBadgeTone.BLUE}>
              <CalendarDays className="size-4" />
            </IconBadge>
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
