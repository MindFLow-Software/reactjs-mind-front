export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  ATTENDING: 'ATTENDING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  NOT_ATTEND: 'NOT_ATTEND',
  RESCHEDULED: 'RESCHEDULED',
} as const

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export interface AppointmentItem {
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

export interface Appointment {
  id: string
  patientProfileId: string
  psychologistPracticeContextId: string
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
  patientProfileId: string
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

export interface AppointmentSession {
  id: string
  appointmentId: string
  createdAt: string
}

export interface SessionParticipant {
  id: string
  sessionId: string
  userId: string
}
