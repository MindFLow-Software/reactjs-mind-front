import { api } from '@/lib/axios'
import type {
  AppointmentItem,
  RegisterAppointmentRequest,
} from '@/types/appointment'

interface RegisterAppointmentResponse {
  message: string
  appointment: AppointmentItem
}

export async function registerAppointment(
  data: RegisterAppointmentRequest,
): Promise<RegisterAppointmentResponse> {
  const payload = {
    ...data,
    scheduledAt: data.scheduledAt.toISOString(),
    startedAt: data.startedAt?.toISOString(),
    endedAt: data.endedAt?.toISOString(),
  }

  const response = await api.post<RegisterAppointmentResponse>(
    '/appointments',
    payload,
  )

  return response.data
}
