import { api } from '@/lib/axios'
import type { AppointmentStatus } from '@/types/appointment'

export interface ActiveAppointment {
  id: string
  patientProfileId: string
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
