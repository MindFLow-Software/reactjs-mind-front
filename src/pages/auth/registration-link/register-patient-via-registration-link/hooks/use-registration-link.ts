import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/constants/query-keys'
import { getRegistrationLinkByHash } from '@/api/registration-link/get-registration-link-by-hash'
import type { IRegistrationLinkInfo } from '@/types/invite/registration-link-info'

type IUseRegistrationLink = {
  isRegistrationLinkInvalid: boolean
  registrationLink: IRegistrationLinkInfo | undefined
}

export function useRegistrationLink(
  hash: string | undefined,
): IUseRegistrationLink {
  const { data, isError } = useQuery({
    queryKey: queryKeys.registrationLink(hash),
    queryFn: () => getRegistrationLinkByHash(hash),
    enabled: Boolean(hash),
  })

  return { registrationLink: data, isRegistrationLinkInvalid: isError }
}
