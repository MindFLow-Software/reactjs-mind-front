import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'

export interface RescheduleAppointmentRequest {
  appointmentId: string
  newDate: Date
}

export async function rescheduleAppointment({
  appointmentId,
  newDate,
}: RescheduleAppointmentRequest): Promise<IMutationResult<void>> {
  const response = await api.put(`/appointments/${appointmentId}/reschedule`, {
    newDate: newDate.toISOString(),
  })

  return { data: response.data, message: response.apiMessage ?? null }
}
