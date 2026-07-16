import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'

export type PatientInviteResponseAction = 'accept' | 'reject'

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
