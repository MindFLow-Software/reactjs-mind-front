import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { markPopupAsViewed } from '@/api/popups/mark-popup-as-viewed'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

interface MarkPopupViewedVars {
  id: string
  action: string
}

export function useMarkPopupViewed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, action }: MarkPopupViewedVars) =>
      markPopupAsViewed(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unseen-popups'] })
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, 'Não foi possível registrar a visualização.'),
      )
    },
  })
}
