import { api } from '@/lib/axios'
import type { IpatientProfile } from '@/types/patient-profile'

export interface IgetPatientProfileByIdResponse {
  patient: IpatientProfile | null
}

export async function getPatientProfileById(
  patientId: string,
): Promise<IgetPatientProfileByIdResponse> {
  const response = await api.get<IgetPatientProfileByIdResponse>(
    `/patients/${patientId}`,
  )
  const patient = response.data.patient

  return {
    patient,
  }
}
