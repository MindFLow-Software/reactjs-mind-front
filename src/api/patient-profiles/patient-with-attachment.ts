import { api } from '@/lib/axios'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

export async function getPatientsWithAttachments(): Promise<IPatientProfile[]> {
  const response = await api.get<{ patients: IPatientProfile[] }>(
    '/patient-profiles/with-attachments',
  )
  return response.data.patients
}
