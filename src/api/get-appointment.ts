import { api } from '@/lib/axios'

// 1. Enum de Status
export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  ATTENDING: 'ATTENDING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  NOT_ATTEND: 'NOT_ATTEND',
  RESCHEDULED: 'RESCHEDULED',
} as const

export type AppointmentStatus =
  typeof AppointmentStatus[keyof typeof AppointmentStatus]

// 2. Interface do Appointment (com relações)
export interface Appointment {
  patientName: string
  id: string
  patientId: string
  psychologistId: string
  diagnosis: string
  notes?: string | null
  scheduledAt: string
  startedAt?: string | null
  endedAt?: string | null
  status: AppointmentStatus

  patient: {
    id(id: any): [any, any]
    firstName: string
    lastName: string
  }
  psychologist: {
    firstName: string
    lastName: string
  }
}

// 3. Request atualizado (AGORA COM cpf e name)
export interface GetAppointmentsRequest {
  pageIndex?: number
  perPage?: number
  status?: string | null
  orderBy?: 'asc' | 'desc'
  cpf?: string
  name?: string
}

// 4. Response
export interface GetAppointmentsResponse {
  appointments: Appointment[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

// 5. Função atualizada (cpf e name incluídos)
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
      ...(params.cpf && { cpf: params.cpf }),
      ...(params.name && { name: params.name }),
    },
  })

  return response.data
}
