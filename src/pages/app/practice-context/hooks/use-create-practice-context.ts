import { useNavigate } from 'react-router-dom'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { queryKeys } from '@/constants/query-keys'
import { createPracticeContext } from '@/api/psychologists/create-practice-context'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import type { IPsychologistPracticeContext } from '@/types/psychologist/practice-context'
import type { IMutationResult } from '@/types/shared/mutation-result'

export function useCreatePracticeContext() {
  const navigate = useNavigate()
  const setActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.setActivePracticeContextId,
  )

  return useApiMutation<
    IMutationResult<IPsychologistPracticeContext>,
    Parameters<typeof createPracticeContext>[0]
  >({
    mutationFn: createPracticeContext,
    successFallback: 'Contexto de atuação criado.',
    errorFallback: 'Erro ao criar contexto de atuação.',
    invalidateKeys: [queryKeys.me],
    onSuccess: (result) => {
      setActivePracticeContextId(result.data.id)
      navigate('/profiles')
    },
  })
}
