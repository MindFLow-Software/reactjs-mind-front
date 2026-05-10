import { api } from "@/lib/axios"

export interface GetPatientDetailsResponse {
  patient: {
    id: string
    firstName: string
    lastName: string
    name: string // 🟢 Adicionado para consistência
    profileImageUrl: string | null
    cpf: string
    email: string
    phoneNumber: string
    status: 'active' | 'inactive'
    isActive: boolean // 🟢 Adicionado como fonte da verdade
    dateOfBirth: string | null 
    gender: 'MASCULINE' | 'FEMININE' | 'OTHER' | null
    sessions: Array<{
      id: string
      date: string
      sessionDate?: string | null
      createdAt: string
      theme: string
      duration: string
      status: string
      content: string | null
    }>
  }
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
    averageDuration: number
  }
}

export async function getPatientDetails(patientId: string, pageIndex: number): Promise<GetPatientDetailsResponse> {
  const response = await api.get<GetPatientDetailsResponse>(`/patients/${patientId}/details`, {
    params: { pageIndex },
  })

  const p = response.data.patient
  const isActive = p.isActive === true || p.status === 'active'

  return {
    ...response.data,
    patient: {
      ...p,
      name: `${p.firstName} ${p.lastName}`.trim(),
      isActive,
      status: isActive ? 'active' : 'inactive',
      profileImageUrl: p.profileImageUrl ?? null,
      dateOfBirth: p.dateOfBirth ?? null,
      gender: p.gender ?? null,
      sessions: p.sessions ?? [],
    },
  }
}