import type { AppointmentStatus } from '@/types/appointment/appointment-status'

export type IDashboardAppointment = {
  id: string
  patientProfileId: string | null
  patientName: string
  psychologistName: string
  scheduledAt: string
  durationInMin: number
  status: AppointmentStatus
  diagnosis: string
}
