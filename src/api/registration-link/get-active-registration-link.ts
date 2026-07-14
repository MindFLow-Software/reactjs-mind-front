import { api } from '@/lib/axios'
import type { IRegistrationLink } from '@/types/invite/registration-link'

type IGetActiveRegistrationLink = {
  registrationLink: IRegistrationLink
}

export async function getActiveRegistrationLink(): Promise<IGetActiveRegistrationLink> {
  const response = await api.get<IGetActiveRegistrationLink>(
    '/registration-links/active',
  )
  return response.data
}
