import { api } from '@/lib/axios'
import type {
  CreatePsychologistProfileBody,
  IPsychologistProfile,
} from '@/types/psychologist'
import type { IMutationResult } from '@/types/api'

export async function createPsychologistProfile(
  body: CreatePsychologistProfileBody,
): Promise<IMutationResult<IPsychologistProfile>> {
  const response = await api.post<IPsychologistProfile>(
    '/psychologist/profile',
    body,
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
