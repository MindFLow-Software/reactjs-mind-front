import { api } from '@/lib/axios'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'
import type { IMutationResult } from '@/types/shared/mutation-result'

export type CreateOwnPatientProfileBody = {
  psychologistPracticeContextId: string | null
}

export async function createOwnPatientProfile(
  body: CreateOwnPatientProfileBody,
): Promise<IMutationResult<IPatientProfile>> {
  const response = await api.post<IPatientProfile>('/me/patient-profiles', body)
  return { data: response.data, message: response.apiMessage ?? null }
}
