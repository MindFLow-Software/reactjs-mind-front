import { api } from '@/lib/axios'
import type { ScheduledAppointmentResponse } from '@/types/invite'

export type { ScheduledAppointmentResponse } from '@/types/invite'

export async function getScheduledAppointment(
  patientId: string,
): Promise<ScheduledAppointmentResponse> {
  const response = await api.get<ScheduledAppointmentResponse>(
    `/appointments/pending/${patientId}`,
  )
  return response.data
}
