import { useNavigate } from 'react-router-dom'

import { useApiMutation } from '@/hooks/use-api-mutation'
import {
  submitPatientInviteResponse,
  type ISubmitPatientInviteResponseParams,
} from '@/api/patient-profiles/submit-patient-invite-response'
import type { IMutationResult } from '@/types/shared/mutation-result'

type IUseSubmitPatientInviteResponse = {
  isSubmittingResponse: boolean
  submitInviteResponse: (params: ISubmitPatientInviteResponseParams) => void
}

export function useSubmitPatientInviteResponse(): IUseSubmitPatientInviteResponse {
  const navigate = useNavigate()

  const { mutate, isPending } = useApiMutation<
    IMutationResult<null>,
    ISubmitPatientInviteResponseParams
  >({
    mutationFn: submitPatientInviteResponse,
    successFallback: 'Resposta ao convite registrada.',
    errorFallback: 'Erro ao responder ao convite.',
    onSuccess: () => {
      navigate('/profiles')
    },
  })

  return { isSubmittingResponse: isPending, submitInviteResponse: mutate }
}
