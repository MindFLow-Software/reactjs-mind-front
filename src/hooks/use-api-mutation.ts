import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

type UseApiMutationOptions<
  TResult extends { message: string | null },
  TVars,
> = {
  successFallback?: string
  errorFallback?: string
  invalidateKeys?: QueryKey[]
} & UseMutationOptions<TResult, unknown, TVars>

export function useApiMutation<
  TResult extends { message: string | null },
  TVars = void,
>({
  successFallback,
  errorFallback = 'Ocorreu um erro. Tente novamente.',
  invalidateKeys,
  onSuccess,
  onError,
  ...options
}: UseApiMutationOptions<TResult, TVars>): UseMutationResult<
  TResult,
  unknown,
  TVars
> {
  const queryClient = useQueryClient()

  return useMutation<TResult, unknown, TVars>({
    ...options,
    onSuccess: async (result, variables, onMutateResult, context) => {
      toast.success(result.message ?? successFallback)
      if (invalidateKeys) {
        await Promise.all(
          invalidateKeys.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey }),
          ),
        )
      }
      await onSuccess?.(result, variables, onMutateResult, context)
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error, errorFallback))
      onError?.(error, variables, onMutateResult, context)
    },
  })
}
