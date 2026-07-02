import { api } from '@/lib/axios'

export const createClaimRequest = async (patientProfileId: string) => {
  const response = await api.post('/patient-profiles/claim-requests', {
    patientProfileId,
  })

  return response.data
}
