import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { fetchClaimCandidates } from '@/api/patient-profiles/fetch-claim-candidates'

export function useClaimCandidates() {
  return useQuery({
    queryKey: queryKeys.claimCandidates,
    queryFn: fetchClaimCandidates,
  })
}
