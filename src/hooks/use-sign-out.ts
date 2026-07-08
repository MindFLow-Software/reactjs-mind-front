import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { signOut } from '@/api/auth/sign-out'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

type IuseSignOut = {
  signOut: () => Promise<void>
  isSigningOut: boolean
}

export function useSignOut(): IuseSignOut {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear()
      useActivePracticeContextStore.getState().clearActivePracticeContextId()
      navigate('/sign-in', { replace: true })
    },
    onError: () => {
      navigate('/sign-in', { replace: true })
    },
  })

  return {
    signOut: mutateAsync,
    isSigningOut: isPending,
  }
}
