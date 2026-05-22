import { api } from "@/lib/axios"

export type AppointmentStatus = 'SCHEDULED' | 'DONE' | 'CANCELLED' | 'PENDING'

export interface RegisterAppointmentRequest {
    patientId: string
    diagnosis: string
    notes?: string
    scheduledAt: Date
    startedAt?: Date
    endedAt?: Date
    status: AppointmentStatus
}

export interface RegisterAppointmentResponse {
    message: string
    appointment: {
        id: string
        patientId: string
        psychologistId: string
        diagnosis: string
        notes?: string
        scheduledAt: string
        startedAt?: string
        endedAt?: string
        status: AppointmentStatus
    }
}

export async function registerAppointment(
    data: RegisterAppointmentRequest
): Promise<RegisterAppointmentResponse> {
    
    const payload = {
        ...data,
        scheduledAt: data.scheduledAt.toISOString(),
        startedAt: data.startedAt?.toISOString(),
        endedAt: data.endedAt?.toISOString(),
    }

    const response = await api.post<RegisterAppointmentResponse>("/appointments", payload)
    
    return response.data
}