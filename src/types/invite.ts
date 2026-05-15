export interface RegistrationLinkInfo {
  psychologistId:   string
  psychologistName: string
  expiresAt:        string
}

export interface ScheduledAppointmentResponse {
  appointmentId: string
  scheduledAt:   string
  patientId:     string
  status:        string
}
