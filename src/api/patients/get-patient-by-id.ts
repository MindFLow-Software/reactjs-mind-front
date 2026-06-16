import { api } from '@/lib/axios'
import type { Ipatient } from '@/types/patient'

export interface GetPatientByIdResponse {
  patient: Ipatient | null
}

export async function getPatientById(
  patientId: string,
): Promise<GetPatientByIdResponse> {
  const response = await api.get<GetPatientByIdResponse>(
    `/patients/${patientId}`,
  )

  return { patient: response.data.patient }
}
