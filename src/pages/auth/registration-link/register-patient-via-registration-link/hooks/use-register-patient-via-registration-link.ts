import { useNavigate } from 'react-router-dom'

import { useApiMutation } from '@/hooks/use-api-mutation'
import { registerPatientViaRegistrationLink } from '@/api/registration-link/register-patient-via-registration-link'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type { IRegisterPatientViaRegistrationLinkData } from '@/validators/register-patient-via-registration-link/form/register-patient-via-registration-link-schema'

type IUseRegisterPatientViaRegistrationLink = {
  isRegisteringPatient: boolean
  registerPatient: (data: IRegisterPatientViaRegistrationLinkData) => void
}

export function useRegisterPatientViaRegistrationLink(
  hash: string | undefined,
): IUseRegisterPatientViaRegistrationLink {
  const navigate = useNavigate()

  const { mutate, isPending } = useApiMutation<
    IMutationResult<void>,
    IRegisterPatientViaRegistrationLinkData
  >({
    mutationFn: (data) => registerPatientViaRegistrationLink(hash, data),
    successFallback: 'Cadastro realizado com sucesso.',
    errorFallback: 'Falha ao realizar cadastro.',
    onSuccess: () => {
      navigate('/sign-in')
    },
  })

  return { isRegisteringPatient: isPending, registerPatient: mutate }
}
