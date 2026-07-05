import { useNavigate } from 'react-router-dom'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { submitPatientInviteResponse } from '@/api/patient-profiles/submit-patient-invite-response'
import type { IMutationResult } from '@/types/api'
import type { ISubmitPatientInviteResponseParams } from '@/api/patient-profiles/submit-patient-invite-response'

export function useSubmitPatientInviteResponse() {
  const navigate = useNavigate()

  return useApiMutation<
    IMutationResult<null>,
    ISubmitPatientInviteResponseParams
  >({
    mutationFn: submitPatientInviteResponse,
    successFallback: 'Resposta ao convite registrada.',
    errorFallback: 'Erro ao responder ao convite.',
    onSuccess: () => navigate('/profiles'),
  })
}
