import { useQuery } from '@tanstack/react-query'

import { getProfile } from '@/api/auth/get-profile'
import type { IMeResponse } from '@/types/me/me-response'

type IuseAuth = {
  isError: boolean
  profile: IMeResponse | undefined
  isPending: boolean
  isAuthenticated: boolean
}

export function useAuth(): IuseAuth {
  const {
    data: profile,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['profile'],
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
