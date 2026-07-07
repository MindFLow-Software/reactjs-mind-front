import { useQuery } from '@tanstack/react-query'
import { getRegistrationLinkByHash } from '@/api/registration-link/get-registration-link-by-hash'

export function useRegistrationLink(hash: string | undefined) {
  return useQuery({
    queryKey: ['registration-links', hash],
    queryFn: async () => await getRegistrationLinkByHash(hash),
  })
}
