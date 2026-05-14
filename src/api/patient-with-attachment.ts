import { api } from '@/lib/axios'
import type { PatientHTTP } from '@/contracts/types'

export type { PatientHTTP } from '@/contracts/types'

export async function getPatientsWithAttachments(): Promise<PatientHTTP[]> {
  const response = await api.get<{ patients: PatientHTTP[] }>(
    '/patients/filter/with-attachments',
  )
  return response.data.patients
}
