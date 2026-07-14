import { api } from '@/lib/axios'
import type { RegistrationLinkInfo } from '@/types/invite'

export type { RegistrationLinkInfo } from '@/types/invite'

export async function getRegistrationLinkByHash(
  hash: string | undefined,
): Promise<RegistrationLinkInfo> {
  const response = await api.get<RegistrationLinkInfo>(
    `/registration-links/${hash}`,
  )
  return response.data
}
