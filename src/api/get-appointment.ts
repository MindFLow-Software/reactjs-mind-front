import { api } from '@/lib/axios'

export interface Appointment {
  id: string
  patientId: string
  scheduledAt: string
  status: string
  diagnosis: string
}

export interface GetAppointmentsRequest {
  pageIndex?: number
  perPage?: number
  status?: string | null
  orderBy?: 'asc' | 'desc'
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
    },
  })

  return response.data
}