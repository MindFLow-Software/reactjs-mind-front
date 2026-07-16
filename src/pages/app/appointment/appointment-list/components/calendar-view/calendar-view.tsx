import { useState } from 'react'
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type View,
  type ToolbarProps,
} from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Clock,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Time } from '@/utils/time'
import { type IAppointmentListItem } from '@/api/appointments/get-appointments'
import { AppointmentStatus } from '@/types/appointment/appointment-status'
import { translatedAppointmentStatus } from '@/constants/translated-appointment-status'

import type { ICalendarAppointment } from '../../types'

import './calendar-view.css'

// react-big-calendar's localizer takes date-fns primitives by reference; this is
// library wiring, not app-level date formatting (which goes through `Time`).
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'pt-BR': ptBR },
})

type IStatusStyle = {
  block: string
  dot: string
}

const STATUS_STYLES: Record<AppointmentStatus, IStatusStyle> = {
  [AppointmentStatus.SCHEDULED]: {
    block: 'cv-status-scheduled',
    dot: 'cv-dot-scheduled',
  },
  [AppointmentStatus.RESCHEDULED]: {
    block: 'cv-status-rescheduled',
    dot: 'cv-dot-rescheduled',
  },
  [AppointmentStatus.ATTENDING]: {
    block: 'cv-status-attending',
    dot: 'cv-dot-attending',
  },
  [AppointmentStatus.FINISHED]: {
    block: 'cv-status-finished',
    dot: 'cv-dot-finished',
  },
  [AppointmentStatus.CANCELED]: {
    block: 'cv-status-canceled',
    dot: 'cv-dot-canceled',
  },
  [AppointmentStatus.NOT_ATTEND]: {
    block: 'cv-status-not-attend',
    dot: 'cv-dot-not-attend',
  },
}

const VIEW_OPTIONS = [
  { value: Views.MONTH, label: 'Mês', icon: LayoutGrid },
  { value: Views.WEEK, label: 'Semana', icon: CalendarIcon },
  { value: Views.DAY, label: 'Dia', icon: Clock },
  { value: Views.AGENDA, label: 'Lista', icon: List },
] as const

const CALENDAR_MESSAGES = {
  showMore: (total: number) => `+${total} mais`,
  noEventsInRange: 'Sem agendamentos',
}

const DAY_START_HOUR = 7
const DAY_END_HOUR = 21

type ICustomEvent = {
  event: ICalendarAppointment
}

function CustomEvent({ event }: ICustomEvent) {
  const status = event.resource?.status ?? AppointmentStatus.SCHEDULED
  const styles =
    STATUS_STYLES[status] ?? STATUS_STYLES[AppointmentStatus.SCHEDULED]

  return (
    <div className={cn('cv-event', styles.block)}>
      <div className="cv-event-body">
        <div className={cn('cv-event-dot', styles.dot)} />
        <span className="cv-event-label">{event.title}</span>
      </div>
    </div>
  )
}

function CustomToolbar({
  date,
  view,
  onNavigate,
  onView,
}: ToolbarProps<ICalendarAppointment, IAppointmentListItem>) {
  return (
    <div className="cv-toolbar">
      <div className="cv-toolbar-nav">
        <div className="cv-toolbar-group">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('PREV')}
            className="cv-toolbar-nav-btn"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('NEXT')}
            className="cv-toolbar-nav-btn"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <span className="cv-toolbar-title">{Time.toLongMonthYear(date)}</span>
      </div>

      <div className="cv-toolbar-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
          className="cv-toolbar-today"
        >
          Hoje
        </Button>
        <div className="cv-toolbar-group">
          {VIEW_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={view === option.value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onView(option.value)}
              className="cv-toolbar-view-btn"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

type ICalendarView = {
  events: ICalendarAppointment[]
  onSelectSlot: (date: Date) => void
  onSelectEvent: (appointment: IAppointmentListItem) => void
}

export function CalendarView({
  events,
  onSelectSlot,
  onSelectEvent,
}: ICalendarView) {
  const [view, setView] = useState<View>(Views.WEEK)
  const [date, setDate] = useState(new Date())

  return (
    <div className="cv-container">
      <Calendar<ICalendarAppointment, IAppointmentListItem>
        localizer={localizer}
        events={events}
        date={date}
        onNavigate={setDate}
        view={view}
        onView={setView}
        culture="pt-BR"
        messages={CALENDAR_MESSAGES}
        components={{ event: CustomEvent, toolbar: CustomToolbar }}
        step={30}
        timeslots={2}
        selectable
        onSelectSlot={({ start }) => onSelectSlot(start as Date)}
        onSelectEvent={(event) => onSelectEvent(event.resource)}
        min={new Date(0, 0, 0, DAY_START_HOUR, 0, 0)}
        max={new Date(0, 0, 0, DAY_END_HOUR, 0, 0)}
      />

      <div className="cv-legend">
        {Object.values(AppointmentStatus).map((status) => (
          <div key={status} className="cv-legend-item">
            <div className={cn('cv-legend-dot', STATUS_STYLES[status].dot)} />
            <span className="cv-legend-label">
              {translatedAppointmentStatus[status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
