import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/api'
import type { IPatientProfileClaimRequest } from '@/types/patient-profile-claim-request'

export async function createClaimRequest(
  patientProfileId: string,
): Promise<IMutationResult<IPatientProfileClaimRequest>> {
  const response = await api.post<IPatientProfileClaimRequest>(
    '/patient-profiles/claim-requests',
    { patientProfileId },
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
