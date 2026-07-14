import { api } from '@/lib/axios'
import type { IPatientProfile } from '@/types/patient-profile'
import type { IMutationResult } from '@/types/shared/mutation-result'

export interface ClaimPatientProfileByAccessCodeBody {
  code: string
}

export async function claimPatientProfileByAccessCode(
  body: ClaimPatientProfileByAccessCodeBody,
): Promise<IMutationResult<IPatientProfile>> {
  const response = await api.post<IPatientProfile>(
    '/patient-profiles/access-code/claim',
    body,
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
