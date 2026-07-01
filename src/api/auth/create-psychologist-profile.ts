import { api } from '@/lib/axios'
import type {
  CreatePsychologistProfileBody,
  IPsychologistProfile,
} from '@/types/psychologist'

export async function createPsychologistProfile(
  body: CreatePsychologistProfileBody,
): Promise<IPsychologistProfile> {
  const response = await api.post<IPsychologistProfile>(
    '/psychologist/profile',
    body,
  )
  return response.data
}
