import { useNavigate } from 'react-router-dom'

import { signIn } from '@/api/auth/sign-in'
import { createUser } from '@/api/auth/create-user'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { queryKeys } from '@/constants/query-keys'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type { ICreateUserData } from '@/validators/user/form/create-user-schema'

import { buildCreateUserBody } from '../helpers'

type IUseSignUp = {
  isSigningUp: boolean
  signUp: (data: ICreateUserData) => void
}

export function useSignUp(): IUseSignUp {
  const navigate = useNavigate()

  const { mutate, isPending } = useApiMutation<
    IMutationResult<void>,
    ICreateUserData
  >({
    mutationFn: async (data) => {
      const result = await createUser(buildCreateUserBody(data))
      await signIn({ email: data.email, password: data.password })
      return result
    },
    successFallback: 'Conta criada com sucesso!',
    errorFallback: 'Erro ao realizar cadastro.',
    invalidateKeys: [queryKeys.profile],
    onSuccess: () => {
      navigate('/profiles')
    },
  })

  return { isSigningUp: isPending, signUp: mutate }
}
