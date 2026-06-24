import { api } from '@/lib/axios'

type IvalidateInviteResponse = {
  psychologistCrp: string
  patientFirstName: string
  psychologistDisplayName: string
  expiresAt: Date
  userHasAccount?: boolean
}

export const validatePatientInvite = async (
  token: string | undefined,
): Promise<IvalidateInviteResponse> => {
  const response = await api.get<IvalidateInviteResponse>(
    `/patient-profiles/invites/${token}`,
  )

  return response.data
}
