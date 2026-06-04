import { api } from '@/lib/axios'
import type { RegistrationLinkInfo } from '@/types/invite'

export type { RegistrationLinkInfo } from '@/types/invite'

export async function getInviteDetails(
  hash: string,
): Promise<RegistrationLinkInfo> {
  const response = await api.get<RegistrationLinkInfo>(`/invites/${hash}`)
  return response.data
}
