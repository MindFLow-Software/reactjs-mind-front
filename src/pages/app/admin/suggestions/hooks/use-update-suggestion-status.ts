import { useApiMutation } from '@/hooks/use-api-mutation'
import { updateSuggestionStatus } from '@/api/suggestions/update-suggestion-status'

export function useUpdateSuggestionStatus() {
  return useApiMutation({
    mutationFn: updateSuggestionStatus,
    successFallback: 'Sugestão atualizada com sucesso!',
    errorFallback: 'Falha ao processar moderação.',
    invalidateKeys: [
      ['admin', 'suggestions'],
      ['admin', 'suggestions-stats'],
    ],
  })
}
