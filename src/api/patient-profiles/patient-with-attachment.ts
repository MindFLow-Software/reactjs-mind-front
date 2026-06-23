import { api } from '@/lib/axios'
import type { IpatientProfile } from '@/types/patient-profile'

// TODO: Change this when backend changes the same route
export async function getPatientsWithAttachments(): Promise<IpatientProfile[]> {
  const response = await api.get<{ patients: IpatientProfile[] }>(
    '/patients/filter/with-attachments',
  )
  return response.data.patients
}
