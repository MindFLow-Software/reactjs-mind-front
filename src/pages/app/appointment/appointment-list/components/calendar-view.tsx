'use client'

import { useState, useMemo } from 'react'
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
import { type IAppointmentListItem } from '@/api/appointments/get-appointments'
import { AppointmentStatus } from '@/types/enums'
import { translatedAppointmentStatus } from '@/constants/translated-appointment-status'

import './calendar-view.css'

const locales = { 'pt-BR': ptBR }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const STATUS_STYLES: Record<AppointmentStatus, { block: string; dot: string }> =
  {
    SCHEDULED: { block: 'cv-status-scheduled', dot: 'cv-dot-scheduled' },
    RESCHEDULED: { block: 'cv-status-rescheduled', dot: 'cv-dot-rescheduled' },
    ATTENDING: { block: 'cv-status-attending', dot: 'cv-dot-attending' },
    FINISHED: { block: 'cv-status-finished', dot: 'cv-dot-finished' },
    CANCELED: { block: 'cv-status-canceled', dot: 'cv-dot-canceled' },
    NOT_ATTEND: { block: 'cv-status-not-attend', dot: 'cv-dot-not-attend' },
  }

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: IAppointmentListItem
}

function CustomEvent({ event }: { event: CalendarEvent }) {
  const status = event.resource?.status ?? AppointmentStatus.SCHEDULED
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.SCHEDULED

  return (
    <div className={cn('cv-event', styles.block)}>
      <div className="flex items-center gap-1.5 overflow-hidden">
        <div className={cn('cv-event-dot', styles.dot)} />
        <span className="cv-event-label">{event.title}</span>
      </div>
    </div>
  )
}

const viewOptions = [
  { value: Views.MONTH, label: 'Mês', icon: LayoutGrid },
  { value: Views.WEEK, label: 'Semana', icon: CalendarIcon },
  { value: Views.DAY, label: 'Dia', icon: Clock },
  { value: Views.AGENDA, label: 'Lista', icon: List },
] as const

function CustomToolbar({
  date,
  view,
  onNavigate,
  onView,
}: ToolbarProps<CalendarEvent, IAppointmentListItem>) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-border bg-muted/10">
      <div className="flex items-center gap-4">
        <div className="flex bg-background border border-border rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('PREV')}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('NEXT')}
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-foreground">
          {format(date, 'MMMM yyyy', { locale: ptBR })}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
          className="h-8 font-bold uppercase text-[10px]"
        >
          Hoje
        </Button>
        <div className="flex bg-background border border-border rounded-lg p-1">
          {viewOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={view === opt.value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onView(opt.value)}
              className="h-7 px-3 text-[10px] font-bold uppercase"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface CalendarViewProps {
  appointments: IAppointmentListItem[]
  onSelectSlot: (date: Date) => void
  onSelectEvent: (appointment: IAppointmentListItem) => void
}

export function CalendarView({
  appointments,
  onSelectSlot,
  onSelectEvent,
}: CalendarViewProps) {
  const [view, setView] = useState<View>(Views.WEEK)
  const [date, setDate] = useState(new Date())

  const events = useMemo<CalendarEvent[]>(() => {
    return appointments
      .map((apt) => {
        const startDate = apt.start ?? new Date(apt.scheduledAt)
        const endDate = apt.end ?? new Date(startDate.getTime() + 3600000)

        return {
          id: apt.id,
          title: apt.title ?? 'Consulta',
          start: startDate,
          end: endDate,
          resource: apt,
        }
      })
      .filter((e) => !isNaN(e.start.getTime()))
  }, [appointments])

  return (
    <div className="cv-container h-full flex flex-col bg-card rounded-xl border border-border overflow-hidden">
      <Calendar<CalendarEvent, IAppointmentListItem>
        localizer={localizer}
        events={events}
        date={date}
        onNavigate={setDate}
        view={view}
        onView={setView}
        culture="pt-BR"
        messages={{
          showMore: (total) => `+${total} mais`,
          noEventsInRange: 'Sem agendamentos',
        }}
        components={{
          event: CustomEvent,
          toolbar: CustomToolbar,
        }}
        step={30}
        timeslots={2}
        selectable
        onSelectSlot={({ start }) => onSelectSlot(start as Date)}
        onSelectEvent={(event) => onSelectEvent(event.resource)}
        min={new Date(0, 0, 0, 7, 0, 0)}
        max={new Date(0, 0, 0, 21, 0, 0)}
      />

      <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-border bg-muted/30">
        {Object.values(AppointmentStatus).map((status) => (
          <div key={status} className="flex items-center gap-1.5">
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
