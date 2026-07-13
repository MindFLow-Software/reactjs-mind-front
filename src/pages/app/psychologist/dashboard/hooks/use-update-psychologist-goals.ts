import { useApiMutation } from '@/hooks/use-api-mutation'
import { updatePsychologistGoals } from '@/api/dashboard/update-psychologist-goals'

export function useUpdatePsychologistGoals() {
  return useApiMutation({
    mutationFn: updatePsychologistGoals,
    successFallback: 'Metas atualizadas!',
    errorFallback: 'Erro ao atualizar metas.',
    invalidateKeys: [['dashboard', 'psychologist']],
  })
}
