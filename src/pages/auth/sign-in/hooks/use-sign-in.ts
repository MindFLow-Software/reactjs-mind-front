import { useNavigate } from 'react-router-dom'

import { signIn as apiSignInFn, type ISignInBody } from '@/api/auth/sign-in'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { queryKeys } from '@/constants/query-keys'
import type { ISessionRawResponse } from '@/types/shared/session-raw-response'

type IUseSignIn = {
  isSigningIn: boolean
  signIn: (credentials: ISignInBody) => void
}

export function useSignIn(): IUseSignIn {
  const navigate = useNavigate()

  const { mutate, isPending } = useApiMutation<
    ISessionRawResponse,
    ISignInBody
  >({
    mutationFn: apiSignInFn,
    successFallback: 'Login realizado com sucesso!',
    errorFallback: 'Erro ao entrar. Tente novamente.',
    invalidateKeys: [queryKeys.profile],
    onSuccess: () => {
      navigate('/dashboard', { replace: true })
    },
  })

  return { isSigningIn: isPending, signIn: mutate }
}
