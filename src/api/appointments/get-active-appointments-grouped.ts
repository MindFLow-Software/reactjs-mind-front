import { api } from '@/lib/axios'

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

export interface ActiveAppointment {
  id: string
  patientId: string
  patientName: string
  diagnosis: string
  scheduledAt: string
  status: AppointmentStatus
  notes?: string | null
}

export interface GetActiveAppointmentsGroupedResponse {
  grouped: Record<string, ActiveAppointment[]>
}

export async function getActiveAppointmentsGrouped(): Promise<GetActiveAppointmentsGroupedResponse> {
  const response = await api.get<GetActiveAppointmentsGroupedResponse>(
    '/appointments/active/grouped',
  )

  return response.data
}