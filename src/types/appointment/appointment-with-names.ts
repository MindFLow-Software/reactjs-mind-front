import type { IAppointment } from '@/types/appointment/appointment'

export type IAppointmentWithNames = IAppointment & {
  patient: {
    firstName: string
    lastName: string
  } | null
  psychologist: {
    firstName: string
    lastName: string
  } | null
}
