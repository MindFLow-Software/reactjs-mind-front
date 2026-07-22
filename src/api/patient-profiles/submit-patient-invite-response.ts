import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type { PatientInviteResponseAction } from '@/types/invite/patient-invite-response-action'

export type ISubmitPatientInviteResponseParams = {
  token: string | undefined
  action: PatientInviteResponseAction
}

export async function submitPatientInviteResponse({
  token,
  action,
}: ISubmitPatientInviteResponseParams): Promise<IMutationResult<null>> {
  const response = await api.post(
    `/patient-profiles/invites/${token}/${action}`,
  )
  return { data: null, message: response.apiMessage ?? null }
}
