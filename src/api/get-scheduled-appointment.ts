import { api } from "@/lib/axios"

export interface ScheduledAppointmentResponse {
    appointmentId: string
    scheduledAt: string
    // Adicione outros dados da consulta pendente, se necessário (status, etc.)
}

/**
 * Busca o agendamento mais recente e SCHEDULED para um paciente específico.
 * * @param patientId O ID do paciente selecionado (Necessário para a rota do backend).
 * @returns Promise<ScheduledAppointmentResponse>
 */
export async function getScheduledAppointment(
    patientId: string
): Promise<ScheduledAppointmentResponse> {
    
    // Chama o novo endpoint que criamos no backend: GET /appointments/pending/:patientId
    const response = await api.get<ScheduledAppointmentResponse>(
        `/appointments/pending/${patientId}`
    )
    
    return response.data
}