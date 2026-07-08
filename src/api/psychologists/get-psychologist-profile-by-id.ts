import { api } from '@/lib/axios'
import type { IPsychologistProfile } from '@/types/psychologist'

type IGetPsychologistProfileById = {
  psychologist: IPsychologistProfile
}

export async function getPsychologistProfileById(
  psychologistProfileId: string | null,
): Promise<IGetPsychologistProfileById> {
  const response = await api.get<IGetPsychologistProfileById>(
    `/psychologist/profile/${psychologistProfileId}`,
  )
  return response.data
}
