import { api } from '@/lib/axios'
import type { IPatientProfileClaimRequestDetail } from '@/types/claim/patient-profile-claim-request-detail'

type IgetPatientProfileClaimRequestByIdResponse = {
  request: IPatientProfileClaimRequestDetail | null
}

export const getPatientProfileClaimRequestById = async (
  claimRequestId: string | null,
): Promise<IgetPatientProfileClaimRequestByIdResponse> => {
  const response = await api.get<IgetPatientProfileClaimRequestByIdResponse>(
    `/patient-profiles/claim-requests/${claimRequestId}`,
  )
  return response.data
}
