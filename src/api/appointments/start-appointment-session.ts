import { api } from "@/lib/axios"

interface StartAppointmentSessionRequest {
  appointmentId: string
}

interface StartAppointmentSessionResponse {
  message: string
  sessionId: string
}

export async function startAppointmentSession({
  appointmentId,
}: StartAppointmentSessionRequest): Promise<StartAppointmentSessionResponse> {
  const response = await api.post<StartAppointmentSessionResponse>(
    `/appointments/${appointmentId}/start`
  )

  return response.data
}