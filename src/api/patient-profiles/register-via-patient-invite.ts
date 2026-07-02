import { api } from '@/lib/axios'
import type { IregisterViaPatientInvite } from '@/validators/register-via-patient-invite'

export const registerViaPatientInvite = async (
  token: string | undefined,
  data: IregisterViaPatientInvite,
): Promise<void> => {
  const response = await api.post(
    `/patient-profiles/invites/${token}/register`,
    data,
  )
  return response.data
}
