import { api } from '@/lib/axios'
import type { IAppointment } from '@/types/appointment'

export interface Appointment extends IAppointment {
  patientName: string
  patient: {
    firstName: string
    lastName: string
  } | null

  // Campos adicionados para compatibilidade com o Calendário (Frontend)
  start?: Date
  end?: Date
  title?: string
}

export interface GetAppointmentsRequest {
  pageIndex?: number
  perPage?: number
  status?: string | null
  orderBy?: 'asc' | 'desc'
  name?: string
}

export interface GetAppointmentsResponse {
  appointments: Appointment[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getAppointments(
  params: GetAppointmentsRequest,
): Promise<GetAppointmentsResponse> {
  const finalOrderBy = (params.orderBy ?? 'desc') as 'asc' | 'desc'

  const response = await api.get<GetAppointmentsResponse>('/appointments', {
    params: {
      pageIndex: params.pageIndex ?? 0,
      perPage: params.perPage ?? 10,
      orderBy: finalOrderBy,
      ...(params.status && { status: params.status }),
      ...(params.name &&
        params.name.trim() !== '' && { patientName: params.name.trim() }),
    },
  })

  return response.data
}
