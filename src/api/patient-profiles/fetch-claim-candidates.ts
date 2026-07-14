import { api } from '@/lib/axios'
import type { IClaimCandidate } from '@/types/claim/claim-candidate'

type IClaimCandidatesResponse = {
  candidates: IClaimCandidate[]
}

export const fetchClaimCandidates =
  async (): Promise<IClaimCandidatesResponse> => {
    const response = await api.get<IClaimCandidatesResponse>(
      '/me/patient-profiles/claim-candidates',
    )
    return response.data
  }
