import { api } from '@/lib/axios'
import type { Appointment } from '@/types/appointment'

export type { Appointment }

export interface FetchAppointmentsParams {
  pageIndex?: number
  perPage?: number
  orderBy?: 'asc' | 'desc'
}

export interface FetchAppointmentsResponse {
  appointments: Appointment[]
}

export async function fetchAppointments(
  params: FetchAppointmentsParams,
): Promise<FetchAppointmentsResponse> {
  const response = await api.get<FetchAppointmentsResponse>('/appointments', {
    params,
  })

  return response.data
}
