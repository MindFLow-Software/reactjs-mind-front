import { api } from '@/lib/axios'
import type { RegistrationLinkInfo } from '@/contracts/types'

export type { RegistrationLinkInfo } from '@/contracts/types'

export async function getInviteDetails(hash: string): Promise<RegistrationLinkInfo> {
  const response = await api.get<RegistrationLinkInfo>(`/invites/${hash}`)
  return response.data
}
