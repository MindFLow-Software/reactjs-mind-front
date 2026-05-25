import { api } from "@/lib/axios"

export interface StartAppointmentResponse {
    message: string
    appointment: {
        id: string
        status: string
        startedAt: string
        patientId: string
        psychologistId: string
        diagnosis: string
        notes: string | null
        scheduledAt: string
        endedAt: string | null
    }
}

/**
 * Envia uma requisição PATCH para iniciar um agendamento.
 * @param appointmentId O ID do agendamento a ser iniciado.
 */
export async function startAppointment(
    appointmentId: string
): Promise<StartAppointmentResponse> {

    const response = await api.patch<StartAppointmentResponse>(
        `/appointments/${appointmentId}/start`
    )

    return response.data
}