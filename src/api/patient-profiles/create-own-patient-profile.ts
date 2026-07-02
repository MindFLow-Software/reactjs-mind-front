import { api } from '@/lib/axios'

export const createOwnPatientProfile = async () => {
  await api.post('/patient-profiles')
}
