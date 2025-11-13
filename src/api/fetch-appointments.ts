import { api } from "@/lib/axios"

export interface Appointment {
  id: string
  patientId: string
  psychologistId: string
  diagnosis: string
  notes: string | null
  scheduledAt: string
  startedAt: string | null
  endedAt: string | null
  status: string
  // Assumindo que a resposta do endpoint FetchAppointmentsController inclui relações
  patient: { firstName: string; lastName: string }
  psychologist: { firstName: string; lastName: string }
}

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
  const response = await api.get<FetchAppointmentsResponse>("/appointments", {
    params, // Axios anexa pageIndex, perPage e orderBy como query parameters
  })

  return response.data
}