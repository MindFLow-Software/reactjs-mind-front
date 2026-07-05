import { api } from '@/lib/axios'

export async function deletePatientProfile(patientId: string): Promise<void> {
  await api.delete(`/patient-profiles/${patientId}`)
}
