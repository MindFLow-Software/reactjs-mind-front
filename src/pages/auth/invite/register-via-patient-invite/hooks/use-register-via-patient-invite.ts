import { useNavigate } from 'react-router-dom'

import { signIn } from '@/api/auth/sign-in'
import { registerViaPatientInvite } from '@/api/patient-profiles/register-via-patient-invite'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { queryKeys } from '@/constants/query-keys'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type { IRegisterViaPatientInviteData } from '@/validators/register-via-patient-invite/form/register-via-patient-invite-schema'

type IUseRegisterViaPatientInvite = {
  isRegistering: boolean
  registerPatientAccount: (data: IRegisterViaPatientInviteData) => void
}

export function useRegisterViaPatientInvite(
  token: string | undefined,
): IUseRegisterViaPatientInvite {
  const navigate = useNavigate()

  const { mutate, isPending } = useApiMutation<
    IMutationResult<null>,
    IRegisterViaPatientInviteData
  >({
    mutationFn: async (data) => {
      const result = await registerViaPatientInvite(token, data)
      await signIn({ email: data.email, password: data.password })
      return result
    },
    successFallback: 'Conta criada com sucesso.',
    errorFallback: 'Erro ao criar conta.',
    invalidateKeys: [queryKeys.profile],
    onSuccess: () => {
      navigate(`/patient/invite/${token}/review`)
    },
  })

  return { isRegistering: isPending, registerPatientAccount: mutate }
}
