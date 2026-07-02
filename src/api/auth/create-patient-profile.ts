import { api } from '@/lib/axios'

export interface CreatePatientProfileBody {
  psychologistPracticeContextId: string | null
}

export async function createPatientProfile(
  body: CreatePatientProfileBody,
): Promise<{ patientId: string }> {
  const response = await api.post<{ patientId: string }>(
    '/patient/profile',
    body,
  )
  return response.data
}
