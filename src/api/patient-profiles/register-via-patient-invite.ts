import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/api'
import type { RegisterViaPatientInviteData } from '@/validators/register-via-patient-invite/form/register-via-patient-invite-schema'

export async function registerViaPatientInvite(
  token: string | undefined,
  data: RegisterViaPatientInviteData,
): Promise<IMutationResult<null>> {
  const response = await api.post(
    `/patient-profiles/invites/${token}/register`,
    data,
  )
  return { data: null, message: response.apiMessage ?? null }
}
