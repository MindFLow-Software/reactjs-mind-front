import { api } from '@/lib/axios'
import type { IPatientProfileClaimRequest } from '@/types/patient-profile-claim-request'

type IfetchClaimProfileRequestsResponse = {
  requests: IPatientProfileClaimRequest[]
}

export const fetchClaimProfileRequests =
  async (): Promise<IfetchClaimProfileRequestsResponse> => {
    const response = await api.get<IfetchClaimProfileRequestsResponse>(
      '/patient-profiles/claim-requests',
    )
    return response.data
  }
