import type { AppointmentStatus } from '@/types/enums'

export type { AppointmentStatus }

export interface IAppointment {
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

export interface IAppointmentWithNames extends IAppointment {
  patient: {
    firstName: string
    lastName: string
  } | null
  psychologist: {
    firstName: string
    lastName: string
  } | null
}

export interface RegisterAppointmentResponse {
  message: string
  appointment: IAppointment
}

export interface IAppointmentSession {
  id: string
  appointmentId: string
  startedAt: string
  endedAt: string | null
  durationInMin: number | null
  meetingLink: string | null
  notes: string | null
}

export interface ISessionParticipant {
  participantType: 'PSYCHOLOGIST' | 'PATIENT' | null
  psychologistPracticeContextId: string | null
  patientProfileId: string | null
  joinedAt: string
  leftAt: string | null
}
