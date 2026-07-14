import { api } from '@/lib/axios'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

export interface IgetPatientProfileByCpfResponse {
  patient: IPatientProfile | null
}

export async function getPatientByCpf(
  cpf: string,
): Promise<IgetPatientProfileByCpfResponse> {
  const response = await api.get<IgetPatientProfileByCpfResponse>(
    `/patient-profiles/cpf/${cpf}`,
  )
  return response.data
}
