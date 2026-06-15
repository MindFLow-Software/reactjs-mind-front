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
