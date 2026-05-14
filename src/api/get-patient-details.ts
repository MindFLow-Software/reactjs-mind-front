import { api } from "@/lib/axios"

export interface SessionItem {
  id: string
  date: string
  sessionDate: string
  createdAt: string
  theme: string
  duration: string
  status: 'Concluída' | 'Pendente'
  content: string | null
}

export interface GetPatientDetailsResponse {
  patient: {
    id: string
    firstName: string
    lastName: string
    cpf: string | null
    email: string | null
    profileImageUrl: string | null
    phoneNumber: string | null
    dateOfBirth: string | null
    gender: 'MASCULINE' | 'FEMININE' | 'OTHER'
    sessions: SessionItem[]
  }
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
    averageDuration: number | null
  }
}

export async function getPatientDetails(patientId: string, pageIndex: number): Promise<GetPatientDetailsResponse> {
  const response = await api.get<GetPatientDetailsResponse>(`/patients/${patientId}/details`, {
    params: { pageIndex },
  })

  return {
    ...response.data,
    patient: {
      ...response.data.patient,
      sessions: response.data.patient.sessions ?? [],
    },
  }
}
