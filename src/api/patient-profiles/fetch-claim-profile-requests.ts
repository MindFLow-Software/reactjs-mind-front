import { api } from '@/lib/axios'
import type { IpatientProfileClaimRequestWithRequester } from '@/types/patient-profile-claim-request'

type IfetchClaimProfileRequestsResponse = {
  requests: IpatientProfileClaimRequestWithRequester[]
}

export const fetchClaimProfileRequests =
  async (): Promise<IfetchClaimProfileRequestsResponse> => {
    const response = await api.get<IfetchClaimProfileRequestsResponse>(
      '/patient-profiles/claim-requests',
    )
    return response.data
  }
