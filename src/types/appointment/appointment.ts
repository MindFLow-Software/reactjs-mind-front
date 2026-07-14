import type { AppointmentStatus } from '@/types/appointment/appointment-status'

export type IAppointment = {
  id: string
  patientProfileId: string | null
  psychologistPracticeContextId: string | null
  diagnosis: string
  content: string | null
  scheduledAt: string
  durationInMin: number | null
  status: AppointmentStatus
  createdAt: string
}
