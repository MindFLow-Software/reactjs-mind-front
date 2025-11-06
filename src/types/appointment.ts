export interface Appointment {
  id: string
  patientId: string
  psychologistId: string
  diagnosis: string
  notes?: string
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  status: string
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