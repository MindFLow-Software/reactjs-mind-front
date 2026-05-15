import { api } from '@/lib/axios'
import type { PatientHTTP } from '@/types/patient'

export type { PatientHTTP } from '@/types/patient'

export async function getPatientsWithAttachments(): Promise<PatientHTTP[]> {
  const response = await api.get<{ patients: PatientHTTP[] }>(
    '/patients/filter/with-attachments',
  )
  return response.data.patients
}
