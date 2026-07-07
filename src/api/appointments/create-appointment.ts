import { api } from '@/lib/axios'
import type { RegisterAppointmentResponse } from '@/types/appointment'
import type { CreateAppointmentData } from '@/validators/appointments/form/create-appointment-schema'

export async function registerAppointment(
  data: CreateAppointmentData,
): Promise<RegisterAppointmentResponse> {
  const response = await api.post<RegisterAppointmentResponse>(
    '/appointments',
    data,
  )

  return response.data
}
