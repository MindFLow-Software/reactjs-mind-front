import { api } from '@/lib/axios'
import type { IPatientProfile } from '@/types/patient-profile'

// TODO: Change this when backend changes the same route
export async function getPatientsWithAttachments(): Promise<IPatientProfile[]> {
  const response = await api.get<{ patients: IPatientProfile[] }>(
    '/patient-profiles/filter/with-attachments',
  )
  return response.data.patients
}
