import { api } from '@/lib/axios'
import type { IRegistrationLinkInfo } from '@/types/invite/registration-link-info'

export async function getRegistrationLinkByHash(
  hash: string | undefined,
): Promise<IRegistrationLinkInfo> {
  const response = await api.get<IRegistrationLinkInfo>(
    `/registration-links/${hash}`,
  )
  return response.data
}
