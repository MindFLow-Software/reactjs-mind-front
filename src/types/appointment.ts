export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  ATTENDING: 'ATTENDING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  NOT_ATTEND: 'NOT_ATTEND',
  RESCHEDULED: 'RESCHEDULED',
  DONE: 'DONE',
} as const

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export interface AppointmentItem {
  id: string
  patientId: string | null
  psychologistId: string | null
  diagnosis: string
  content: string | null
  scheduledAt: string
  durationInMin: number | null
  status: AppointmentStatus
  createdAt: string
}

export interface Appointment {
  id: string
  patientId: string
  psychologistId: string
  diagnosis: string
  notes?: string | null
  scheduledAt: string
  startedAt?: string | null
  endedAt?: string | null
  status: AppointmentStatus
  durationInMin?: number | null
  patient: {
    firstName: string
    lastName: string
  }
  psychologist: {
    firstName: string
    lastName: string
  }
}

export interface RegisterAppointmentRequest {
  patientId: string
  psychologistId: string
  diagnosis: string
  notes?: string
  scheduledAt: Date
  startedAt?: Date
  endedAt?: Date
  status: string
}

export interface RegisterAppointmentResponse {
  message: string
  appointment: Appointment
}
