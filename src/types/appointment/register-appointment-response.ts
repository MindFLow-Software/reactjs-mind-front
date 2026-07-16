import type { IAppointment } from '@/types/appointment/appointment'

export type IRegisterAppointmentResponse = {
  message: string
  appointment: IAppointment
}
