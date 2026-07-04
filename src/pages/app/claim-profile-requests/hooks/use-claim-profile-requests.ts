import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { fetchClaimProfileRequests } from '@/api/patient-profiles/fetch-claim-profile-requests'

export function useClaimProfileRequests() {
  return useQuery({
    queryKey: queryKeys.claimRequests,
    queryFn: fetchClaimProfileRequests,
  })
}
