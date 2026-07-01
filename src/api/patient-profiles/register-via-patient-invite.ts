import { api } from '@/lib/axios'
import type { RegisterViaPatientInviteData } from '@/validators/register-via-patient-invite/form/register-via-patient-invite-schema'

export const registerViaPatientInvite = async (
  token: string | undefined,
  data: RegisterViaPatientInviteData,
): Promise<void> => {
  const response = await api.post(
    `/patient-profiles/invites/${token}/register`,
    data,
  )
  return response.data
}
