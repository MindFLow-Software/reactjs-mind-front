import { useApiMutation } from '@/hooks/use-api-mutation'
import type { IMutationResult } from '@/types/api'

import { registerPatientViaRegistrationLink } from '@/api/registration-link/register-patient-via-registration-link'
import type { RegisterPatientViaRegistrationLinkData } from '@/validators/register-patient-via-registration-link/form/register-patient-via-registration-link-schema'

type IuseRegisterPatientViaRegistrationLink = {
  isRegisteringPatient: boolean,
  registerPatientViaRegistrationLink: (data: RegisterPatientViaRegistrationLinkData) => Promise<IMutationResult<void>>,
}

export function useRegisterPatientViaRegistrationLink(): IuseRegisterPatientViaRegistrationLink {
  const { mutateAsync, isPending } = useApiMutation({
    mutationFn: registerPatientViaRegistrationLink,
    successFallback: 'Cadastro realizado com sucesso.',
    errorFallback: 'Falha ao realizar cadastro.',
  })

  return {
    isRegisteringPatient: isPending,
    registerPatientViaRegistrationLink: mutateAsync,
  }
}
