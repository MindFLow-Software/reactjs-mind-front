import type { IAppointmentListItem } from '@/api/appointments/get-appointments'

export type ICalendarAppointment = {
  id: string
  title: string
  start: Date
  end: Date
  resource: IAppointmentListItem
}
