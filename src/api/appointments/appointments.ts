import { api } from "@/lib/axios"
import type { Appointment, AppointmentStatus } from "@/types/appointment"


export interface RegisterAppointmentRequest {
    patientId: string
    psychologistId: string 
    diagnosis: string
    notes?: string
    scheduledAt: Date
    startedAt?: Date
    endedAt?: Date
    status: AppointmentStatus
}

export interface RegisterAppointmentResponse {
    message: string
    appointment: Appointment
}

export async function registerAppointment(
    data: RegisterAppointmentRequest
): Promise<RegisterAppointmentResponse> {
    
    const { psychologistId, ...rest } = data
    
    const payload = {
        ...rest, 
        scheduledAt: rest.scheduledAt.toISOString(),
        startedAt: rest.startedAt?.toISOString(),
        endedAt: rest.endedAt?.toISOString(),
    }

    const response = await api.post<RegisterAppointmentResponse>("/appointments", payload)
    
    return response.data
}


export interface FetchAppointmentsParams {
  pageIndex?: number
  perPage?: number
  orderBy?: 'asc' | 'desc'
}

export interface FetchAppointmentsResponse {
  appointments: Appointment[]
}

export async function fetchAppointments(
  params: FetchAppointmentsParams,
): Promise<FetchAppointmentsResponse> {
  const response = await api.get<FetchAppointmentsResponse>("/appointments", {
    params, 
  })

  return response.data
}

