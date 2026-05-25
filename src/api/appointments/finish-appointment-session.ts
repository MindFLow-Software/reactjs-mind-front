import { api } from '@/lib/axios'

interface FinishAppointmentSessionRequest {
  sessionId: string
  content?: string
}

export async function finishAppointmentSession({ 
  sessionId, 
  content 
}: FinishAppointmentSessionRequest) {
  await api.post(`/sessions/${sessionId}/finish`, { content })
}