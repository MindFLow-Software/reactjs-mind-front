import { api } from '@/lib/axios'
import type { PatientHTTP } from '@/types/patient'

export type { PatientHTTP } from '@/types/patient'

export interface GetPatientByIdResponse {
  patient: PatientHTTP
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
      cpf: p.cpf ?? null,
    },
  }
}
