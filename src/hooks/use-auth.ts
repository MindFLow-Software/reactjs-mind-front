import { useQuery } from '@tanstack/react-query'

import { getProfile } from '@/api/auth/get-profile'
import { queryKeys } from '@/constants/query-keys'
import type { IMeResponse } from '@/types/me/me-response'

type IUseAuth = {
  isError: boolean
  profile: IMeResponse | undefined
  isPending: boolean
  isAuthenticated: boolean
}

export function useAuth(): IUseAuth {
  const {
    data: profile,
    isError,
    isPending,
  } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: getProfile,
    staleTime: Infinity,
    retry: false,
  })

  return {
    profile,
    isError,
    isPending,
    isAuthenticated: Boolean(profile),
  }
}
