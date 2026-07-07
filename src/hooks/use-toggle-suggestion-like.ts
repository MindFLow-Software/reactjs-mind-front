import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleSuggestionLike } from '@/api/suggestions/toggle-suggestion-like'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import type { ISuggestion } from '@/types/suggestion'

interface UseToggleSuggestionLikeOptions {
  userId?: string
  extraInvalidateKeys?: QueryKey[]
}

interface ToggleLikeContext {
  previousQueries: [QueryKey, ISuggestion[] | undefined][]
}

export function useToggleSuggestionLike({
  userId,
  extraInvalidateKeys = [],
}: UseToggleSuggestionLikeOptions) {
  const queryClient = useQueryClient()

  const { mutate: toggleLike } = useMutation<
    void,
    unknown,
    string,
    ToggleLikeContext
  >({
    mutationFn: (suggestionId: string) => toggleSuggestionLike(suggestionId),
    onMutate: async (suggestionId) => {
      await queryClient.cancelQueries({ queryKey: ['suggestions'] })
      const previousQueries = queryClient.getQueriesData<ISuggestion[]>({
        queryKey: ['suggestions'],
      })

      queryClient.setQueriesData<ISuggestion[]>(
        { queryKey: ['suggestions'] },
        (old) =>
          old?.map((suggestion) => {
            if (suggestion.id !== suggestionId) return suggestion
            const id = userId ?? ''
            const isLiked = suggestion.likes.includes(id)
            const likes = isLiked
              ? suggestion.likes.filter((likeId) => likeId !== id)
              : [...suggestion.likes, id]
            return { ...suggestion, likes, likesCount: likes.length }
          }),
      )

      return { previousQueries }
    },
    onError: (error, _id, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
      toast.error(
        getApiErrorMessage(error, 'Não foi possível registrar o voto'),
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] })
      extraInvalidateKeys.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      )
    },
  })

  return { toggleLike }
}
