import { api } from '@/lib/axios'
import type { IPatientInviteMetadata } from '@/types/invite/patient-invite-metadata'

export const validatePatientInvite = async (
  token: string | undefined,
): Promise<IPatientInviteMetadata> => {
  const response = await api.get<IPatientInviteMetadata>(
    `/patient-profiles/invites/${token}`,
  )

  return response.data
}
