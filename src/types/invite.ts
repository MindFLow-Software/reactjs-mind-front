import type { PatientInviteStatus } from '@/types/enums'

export interface RegistrationLinkInfo {
  psychologistPracticeContextId: string
  psychologistProfileId: string
  psychologistName: string
  expiresAt: string
}

export interface RegistrationLink {
  id: string
  hash: string
  psychologistPracticeContextId: string
  expiresAt: string
  createdAt: string
}

export interface ScheduledAppointmentResponse {
  appointmentId: string
  scheduledAt: string
  patientId: string
  status: string
}

export interface IPatientInvite {
  patientProfileId: string
  tokenHash: string
  email: string
  expiresAt: string
  status: PatientInviteStatus
  acceptedAt: string | null
  rejectedAt: string | null
}

export interface IPatientInviteMetadata {
  patientFirstName: string
  psychologistCrp: string
  psychologistDisplayName: string
  expiresAt: string
  userHasAccount: boolean
}
