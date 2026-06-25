import { api } from '@/lib/axios'
import type { IclaimRequest } from '@/types/claim-request'

type IfetchClaimProfileRequestsResponse = {
  requests: IclaimRequest[]
}

export const fetchClaimProfileRequests =
  async (): Promise<IfetchClaimProfileRequestsResponse> => {
    const response = await api.get<IfetchClaimProfileRequestsResponse>(
      '/patient-profiles/claim/requests',
    )
    return response.data
  }
