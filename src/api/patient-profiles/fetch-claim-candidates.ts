import { api } from '@/lib/axios'
import type { IclaimCanidate } from '@/types/claim-candidates'

type IclaimCandidatesResponse = {
  candidates: IclaimCanidate[]
}

export const fetchClaimCandidates =
  async (): Promise<IclaimCandidatesResponse> => {
    const response = await api.get<IclaimCandidatesResponse>(
      '/me/patient-profiles/claim-candidates',
    )
    return response.data
  }
