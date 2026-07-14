import { api } from '@/lib/axios'
import type { IRegisterAppointmentResponse } from '@/types/appointment/register-appointment-response'
import type { CreateAppointmentData } from '@/validators/appointments/form/create-appointment-schema'

export async function registerAppointment(
  data: CreateAppointmentData,
): Promise<IRegisterAppointmentResponse> {
  const response = await api.post<IRegisterAppointmentResponse>(
    '/appointments',
    data,
  )

  return response.data
}
