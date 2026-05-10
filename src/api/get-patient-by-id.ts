import { api } from '@/lib/axios'

export interface GetPatientByIdResponse {
  patient: {
    id: string
    firstName: string
    lastName: string
    name: string
    email: string | null
    cpf: string | null
    phoneNumber: string | null
    gender: 'OTHER' | 'FEMININE' | 'MASCULINE' | null
    dateOfBirth: string | null
    profileImageUrl: string | null
    createdAt: string
    lastSessionAt: string | null
  }
}

export async function getPatientById(patientId: string): Promise<GetPatientByIdResponse> {
  const response = await api.get<GetPatientByIdResponse>(`/patients/${patientId}`)
  const p = response.data.patient
  return {
    patient: {
      ...p,
      name: p.name || `${p.firstName} ${p.lastName}`.trim(),
      profileImageUrl: p.profileImageUrl ?? null,
      lastSessionAt: p.lastSessionAt ?? null,
    },
  }
}
