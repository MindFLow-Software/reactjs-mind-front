import { api } from '@/lib/axios'
import type { Ipatient } from '@/types/patient'

export type { Ipatient } from '@/types/patient'

export async function getPatientsWithAttachments(): Promise<Ipatient[]> {
  const response = await api.get<{ patients: Ipatient[] }>(
    '/patients/filter/with-attachments',
  )
  return response.data.patients
}
