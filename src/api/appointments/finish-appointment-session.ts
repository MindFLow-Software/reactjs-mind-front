import { api } from '@/lib/axios'

type FinishAppointmentSessionRequest = {
  sessionId: string
  content?: string
}

export async function finishAppointmentSession({
  sessionId,
  content,
}: FinishAppointmentSessionRequest) {
  await api.post(`/sessions/${sessionId}/finish`, { content })
}
