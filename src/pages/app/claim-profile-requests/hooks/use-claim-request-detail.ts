import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { getPatientProfileClaimRequestById } from '@/api/patient-profiles/get-patient-profile-claim-request-by-id'

export function useClaimRequestDetail(
  claimRequestId: string | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: queryKeys.claimRequest(claimRequestId),
    queryFn: () => getPatientProfileClaimRequestById(claimRequestId),
    enabled,
  })
}
