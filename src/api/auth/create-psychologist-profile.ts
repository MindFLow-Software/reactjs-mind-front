import { api } from '@/lib/axios'
import type {
  CreatePsychologistProfileBody,
  PsychologistProfile,
} from '@/types/psychologist'

export async function createPsychologistProfile(
  body: CreatePsychologistProfileBody,
): Promise<PsychologistProfile> {
  const response = await api.post<PsychologistProfile>(
    '/psychologist/profile',
    body,
  )
  return response.data
}
