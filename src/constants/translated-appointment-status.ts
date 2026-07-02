import { AppointmentStatus } from '@/types/enums'

export const translatedAppointmentStatus: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'Agendado',
  [AppointmentStatus.ATTENDING]: 'Em atendimento',
  [AppointmentStatus.FINISHED]: 'Finalizado',
  [AppointmentStatus.CANCELED]: 'Cancelado',
  [AppointmentStatus.NOT_ATTEND]: 'Faltou',
  [AppointmentStatus.RESCHEDULED]: 'Remarcado',
}
