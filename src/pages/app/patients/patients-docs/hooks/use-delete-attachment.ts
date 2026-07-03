import { useApiMutation } from '@/hooks/use-api-mutation'
import { deleteAttachment } from '@/api/attachments/attachments'

export function useDeleteAttachment() {
  return useApiMutation<{ message: string | null }, string>({
    mutationFn: deleteAttachment,
    successFallback: 'Documento removido.',
    errorFallback: 'Não foi possível remover o documento.',
    invalidateKeys: [['all-attachments'], ['patients-with-attachments']],
  })
}
