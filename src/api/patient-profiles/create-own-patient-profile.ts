import { api } from '@/lib/axios'
import type { IPatientProfile } from '@/types/patient-profile'

export interface CreateOwnPatientProfileBody {
  psychologistPracticeContextId: string | null
}

export async function createOwnPatientProfile(
  body: CreateOwnPatientProfileBody,
): Promise<IPatientProfile> {
  const response = await api.post<IPatientProfile>('/me/patient-profiles', body)
  return response.data
}
