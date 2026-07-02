import { api } from '@/lib/axios'
import type { IpatientProfile } from '@/types/patient-profile'

export interface IgetPatientProfileByCpfResponse {
  patient: IpatientProfile | null
}

export async function getPatientByCpf(
  cpf: string,
): Promise<IgetPatientProfileByCpfResponse> {
  const response = await api.get<IgetPatientProfileByCpfResponse>(
    `/patient-profiles/cpf/${cpf}`,
  )
  return response.data
}
