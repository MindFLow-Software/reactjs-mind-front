import { useApiMutation } from '@/hooks/use-api-mutation'
import { queryKeys } from '@/constants/query-keys'
import {
  submitPatientProfileClaimRequest,
  type ISubmitPatientProfileClaimRequestParams,
} from '@/api/patient-profiles/submit-patient-profile-claim-request'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type { IPatientProfileClaimRequest } from '@/types/claim/patient-profile-claim-request'

interface UseSubmitClaimRequestOptions {
  onReviewed?: () => void
}

export function useSubmitClaimRequest({
  onReviewed,
}: UseSubmitClaimRequestOptions = {}) {
  return useApiMutation<
    IMutationResult<IPatientProfileClaimRequest>,
    ISubmitPatientProfileClaimRequestParams
  >({
    mutationFn: submitPatientProfileClaimRequest,
    successFallback: 'Solicitação atualizada.',
    errorFallback: 'Erro ao atualizar solicitação.',
    invalidateKeys: [queryKeys.claimRequests],
    onSuccess: onReviewed,
  })
}
