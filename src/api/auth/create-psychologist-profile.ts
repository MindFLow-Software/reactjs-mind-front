import { api } from '@/lib/axios'
import type { ICreatePsychologistProfileBody } from '@/types/psychologist/create-psychologist-profile-body'
import type { IPsychologistProfile } from '@/types/psychologist/psychologist-profile'
import type { IMutationResult } from '@/types/shared/mutation-result'

export async function createPsychologistProfile(
  body: ICreatePsychologistProfileBody,
): Promise<IMutationResult<IPsychologistProfile>> {
  const response = await api.post<IPsychologistProfile>(
    '/psychologist/profile',
    body,
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
