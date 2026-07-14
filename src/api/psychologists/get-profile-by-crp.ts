import { api } from '@/lib/axios'
import type { IPsychologistProfile } from '@/types/psychologist/psychologist-profile'

export const getProfileByCrp = async (crp: string) => {
  const response = await api.get<IPsychologistProfile>(
    '/psychologist/profile/search',
    {
      params: {
        crp,
      },
    },
  )

  return response.data
}
