import { api } from '@/lib/axios'
import type { IScheduledAppointmentResponse } from '@/types/invite/scheduled-appointment-response'

export async function getScheduledAppointment(
  patientId: string,
): Promise<IScheduledAppointmentResponse> {
  const response = await api.get<IScheduledAppointmentResponse>(
    `/appointments/pending/${patientId}`,
  )
  return response.data
}
