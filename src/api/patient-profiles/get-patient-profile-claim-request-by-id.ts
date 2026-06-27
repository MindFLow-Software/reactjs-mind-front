import { api } from "@/lib/axios"
import type { IcompletePatientProfileClaimRequest } from "@/types/patient-profile-claim-request"

type IgetPatientProfileClaimRequestByIdResponse = {
  request: IcompletePatientProfileClaimRequest | null
}

export const getPatientProfileClaimRequestById = async (
  claimRequestId: string | null
): Promise<IgetPatientProfileClaimRequestByIdResponse> => {
  const response = await api.get<IgetPatientProfileClaimRequestByIdResponse>(
    `patient-profiles/claim-requests/${claimRequestId}`
  )
  return response.data
}