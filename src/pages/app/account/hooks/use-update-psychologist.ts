import { useApiMutation } from '@/hooks/use-api-mutation'
import { updatePsychologist } from '@/api/psychologists/update-psychologist'

export function useUpdatePsychologist() {
  return useApiMutation({
    mutationFn: updatePsychologist,
    successFallback: 'Perfil atualizado!',
    errorFallback: 'Erro ao atualizar perfil.',
    invalidateKeys: [['psychologist-profile']],
  })
}
