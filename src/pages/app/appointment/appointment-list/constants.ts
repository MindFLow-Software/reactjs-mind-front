import {
  Activity,
  CalendarCheck2,
  CheckCircle2,
  History,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

import { AppointmentStatus } from '@/types/appointment/appointment-status'

export const ALL_STATUS_FILTER = 'all'

export const APPOINTMENT_LIST_PER_PAGE = 100

export type IAppointmentStatusFilter = {
  value: AppointmentStatus
  label: string
  icon: LucideIcon
  iconClassName: string
}

// Plural labels — these read as filter buckets, not as a single appointment's
// status, so they intentionally differ from `translatedAppointmentStatus`.
export const APPOINTMENT_STATUS_FILTERS: readonly IAppointmentStatusFilter[] = [
  {
    value: AppointmentStatus.SCHEDULED,
    label: 'Agendados',
    icon: CalendarCheck2,
    iconClassName: 'text-blue-500',
  },
  {
    value: AppointmentStatus.RESCHEDULED,
    label: 'Remarcados',
    icon: History,
    iconClassName: 'text-purple-500',
  },
  {
    value: AppointmentStatus.ATTENDING,
    label: 'Em atendimento',
    icon: Activity,
    iconClassName: 'text-amber-500',
  },
  {
    value: AppointmentStatus.FINISHED,
    label: 'Finalizados',
    icon: CheckCircle2,
    iconClassName: 'text-emerald-500',
  },
  {
    value: AppointmentStatus.CANCELED,
    label: 'Cancelados',
    icon: XCircle,
    iconClassName: 'text-rose-500',
  },
]
