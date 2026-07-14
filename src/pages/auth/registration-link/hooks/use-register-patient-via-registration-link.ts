import { useNavigate } from 'react-router-dom'
import { useApiMutation } from '@/hooks/use-api-mutation'
import type { IMutationResult } from '@/types/shared/mutation-result'

import { registerPatientViaRegistrationLink } from '@/api/registration-link/register-patient-via-registration-link'
import type { RegisterPatientViaRegistrationLinkData } from '@/validators/register-patient-via-registration-link/form/register-patient-via-registration-link-schema'

type IuseRegisterPatientViaRegistrationLink = {
  isRegisteringPatient: boolean
  registerPatientViaRegistrationLink: (
    data: RegisterPatientViaRegistrationLinkData,
  ) => Promise<IMutationResult<void>>
}

export function useRegisterPatientViaRegistrationLink(
  hash: string | undefined,
): IuseRegisterPatientViaRegistrationLink {
  const navigate = useNavigate()

  const { mutateAsync, isPending } = useApiMutation({
    mutationFn: (data: RegisterPatientViaRegistrationLinkData) =>
      registerPatientViaRegistrationLink(hash, data),
    successFallback: 'Cadastro realizado com sucesso.',
    errorFallback: 'Falha ao realizar cadastro.',
    onSuccess: () => {
      navigate('/sign-in')
    },
  })

  return {
    isRegisteringPatient: isPending,
    registerPatientViaRegistrationLink: mutateAsync,
  }
}
