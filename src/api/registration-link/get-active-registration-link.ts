import { api } from '@/lib/axios'
import type { RegistrationLink } from '@/types/invite'

interface IGetActiveRegistrationLink {
  registrationLink: RegistrationLink
}

export async function getActiveRegistrationLink(): Promise<IGetActiveRegistrationLink> {
  const response = await api.get<IGetActiveRegistrationLink>(
    '/registration-links/active',
  )
  return response.data
}
