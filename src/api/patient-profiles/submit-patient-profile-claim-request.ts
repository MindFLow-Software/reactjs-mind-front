import { api } from '@/lib/axios'

type IsubmitPatientProfileClaimRequest = {
  claimRequestId: string | null
  action: 'approve' | 'reject'
}

export const submitPatientProfileClaimRequest = async ({
  action,
  claimRequestId,
}: IsubmitPatientProfileClaimRequest) => {
  const response = await api.post(`/patient-profiles/claim-requests/${claimRequestId}/${action}`)
  return response.data
}