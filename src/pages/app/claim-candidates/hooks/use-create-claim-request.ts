import { useApiMutation } from '@/hooks/use-api-mutation'
import { queryKeys } from '@/constants/query-keys'
import { createClaimRequest } from '@/api/patient-profiles/create-claim-request'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type { IPatientProfileClaimRequest } from '@/types/claim/patient-profile-claim-request'

export function useCreateClaimRequest() {
  return useApiMutation<IMutationResult<IPatientProfileClaimRequest>, string>({
    mutationFn: createClaimRequest,
    successFallback: 'Solicitação de vínculo enviada.',
    errorFallback: 'Erro ao solicitar vínculo.',
    invalidateKeys: [queryKeys.claimCandidates],
  })
}
