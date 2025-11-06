import { api } from "@/lib/axios"

export const AppointmentStatus = {
    SCHEDULED: "SCHEDULED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED",
} as const

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus]

export interface Appointment {
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

export async function getAppointments(): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>("/appointments")
    return response.data
}
