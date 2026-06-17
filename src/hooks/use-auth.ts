import { useQuery } from '@tanstack/react-query'

import {
  getProfile,
  type IgetMeResponse,
} from '@/api/psychologists/get-profile'

type IuseAuth = {
  isError: boolean
  profile: IgetMeResponse | undefined
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
