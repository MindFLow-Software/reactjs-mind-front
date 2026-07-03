import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createSuggestion } from '@/api/suggestions/create-suggestion'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import type { CreateSuggestionSchema } from '@/validators/suggestions/form/create-suggestion-schema'

interface UseCreateSuggestionOptions {
  onSuccess: () => void
}

interface CreateSuggestionVariables extends CreateSuggestionSchema {
  files: File[]
}

export function useCreateSuggestion({ onSuccess }: UseCreateSuggestionOptions) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (variables: CreateSuggestionVariables) =>
      createSuggestion(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['suggestions'] })
      onSuccess()
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, 'Erro ao enviar sugestão. Tente novamente.'),
      )
    },
  })

  return { submitSuggestion: mutateAsync, isSubmitting: isPending }
}
