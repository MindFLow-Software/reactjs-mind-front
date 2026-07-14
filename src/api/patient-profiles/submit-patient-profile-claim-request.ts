import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type { IPatientProfileClaimRequest } from '@/types/claim/patient-profile-claim-request'

export type ClaimRequestAction = 'approve' | 'reject'

export interface ISubmitPatientProfileClaimRequestParams {
  claimRequestId: string | null
  action: ClaimRequestAction
}

export async function submitPatientProfileClaimRequest({
  action,
  claimRequestId,
}: ISubmitPatientProfileClaimRequestParams): Promise<
  IMutationResult<IPatientProfileClaimRequest>
> {
  const response = await api.post<IPatientProfileClaimRequest>(
    `/patient-profiles/claim-requests/${claimRequestId}/${action}`,
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
