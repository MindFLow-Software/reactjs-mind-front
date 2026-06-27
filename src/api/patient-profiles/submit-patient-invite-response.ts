import { api } from '@/lib/axios'

type IsubmitPatientInviteResponse = {
  token: string | undefined
  action: 'accept' | 'reject'
}

export const submitPatientInviteResponse = async ({
  token,
  action,
}: IsubmitPatientInviteResponse): Promise<void> => {
  await api.post(`patient-profiles/invites/${token}/${action}`)
}
