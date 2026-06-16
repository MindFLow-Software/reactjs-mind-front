import { api } from '@/lib/axios'
import type { PsychologistProfile } from '@/types/psychologist'

export const getProfileByCrp = async (crp: string) => {
  const response = await api.get<PsychologistProfile>(
    '/psychologist/profile/search',
    {
      params: {
        crp,
      },
    },
  )

  return response.data
}
