import { api } from '@/lib/axios'

export async function deletePatients(patientId: string): Promise<void> {
  await api.delete(`/patients/${patientId}`)
}
