import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { signIn } from '@/api/auth/sign-in'
import { registerViaPatientInvite } from '@/api/patient-profiles/register-via-patient-invite'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import type { RegisterViaPatientInviteData } from '@/validators/register-via-patient-invite/form/register-via-patient-invite-schema'

export function useRegisterViaPatientInvite(token: string | undefined) {
  const navigate = useNavigate()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: RegisterViaPatientInviteData) => {
      const { message } = await registerViaPatientInvite(token, data)
      await signIn({ email: data.email, password: data.password })
      return message
    },
    onSuccess: (message) => {
      toast.success(message ?? 'Conta criada com sucesso.')
      navigate(`/patient/invite/${token}/review`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao criar conta.'))
    },
  })

  const registerPatientAccount = useCallback(
    (data: RegisterViaPatientInviteData) => mutateAsync(data),
    [mutateAsync],
  )

  return { registerPatientAccount, isRegistering: isPending }
}
