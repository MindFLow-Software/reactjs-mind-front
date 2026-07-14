import { api } from '@/lib/axios'
import type { IAppointment } from '@/types/appointment/appointment'

export interface FetchAppointmentsParams {
  pageIndex?: number
  perPage?: number
  orderBy?: 'asc' | 'desc'
}

export interface FetchAppointmentsResponse {
  appointments: IAppointment[]
}

export async function fetchAppointments(
  params: FetchAppointmentsParams,
): Promise<FetchAppointmentsResponse> {
  const response = await api.get<FetchAppointmentsResponse>('/appointments', {
    params,
  })

  return response.data
}
