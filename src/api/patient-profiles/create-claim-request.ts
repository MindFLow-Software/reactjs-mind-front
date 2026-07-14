import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type { IPatientProfileClaimRequest } from '@/types/claim/patient-profile-claim-request'

export async function createClaimRequest(
  patientProfileId: string,
): Promise<IMutationResult<IPatientProfileClaimRequest>> {
  const response = await api.post<IPatientProfileClaimRequest>(
    '/patient-profiles/claim-requests',
    { patientProfileId },
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
