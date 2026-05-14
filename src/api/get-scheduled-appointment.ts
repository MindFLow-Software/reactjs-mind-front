import { api } from '@/lib/axios'
import type { ScheduledAppointmentResponse } from '@/contracts/types'

export type { ScheduledAppointmentResponse } from '@/contracts/types'

export async function getScheduledAppointment(
  patientId: string,
): Promise<ScheduledAppointmentResponse> {
  const response = await api.get<ScheduledAppointmentResponse>(
    `/appointments/pending/${patientId}`,
  )
  return response.data
}
