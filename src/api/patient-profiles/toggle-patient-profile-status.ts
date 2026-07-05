import { api } from '@/lib/axios'

export async function togglePatientProfileStatus(id: string) {
  await api.patch(`/patient-profiles/${id}/status`)
}
