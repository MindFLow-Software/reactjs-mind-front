import { api } from '@/lib/axios'
import type { AppointmentStatus } from '@/types/appointment/appointment-status'
import type { IMutationResult } from '@/types/shared/mutation-result'

export interface UpdateAppointmentRequest {
  id: string
  diagnosis?: string
  content?: string | null
  scheduledAt?: Date
  status?: AppointmentStatus
}

export async function updateAppointment({
  id,
  diagnosis,
  content,
  scheduledAt,
  status,
}: UpdateAppointmentRequest): Promise<IMutationResult<void>> {
  const response = await api.put(`/appointments/${id}`, {
    diagnosis,
    content,
    status,
    scheduledAt: scheduledAt?.toISOString(),
  })

  return { data: response.data, message: response.apiMessage ?? null }
}
