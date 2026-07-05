import { api } from '@/lib/axios'
import type { IPatientProfile } from '@/types/patient-profile'

export interface IgetPatientProfileByIdResponse {
  patient: IPatientProfile | null
}

export async function getPatientProfileById(
  patientId: string,
): Promise<IgetPatientProfileByIdResponse> {
  const response = await api.get<IgetPatientProfileByIdResponse>(
    `/patient-profiles/${patientId}`,
  )
  const patient = response.data.patient

  return {
    patient,
  }
}
