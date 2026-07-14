import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'

export interface UpdateSuggestionParams {
  id: string
  status?: string
  title?: string
  category?: string
  description?: string
}

export async function updateSuggestionStatus({
  id,
  ...data
}: UpdateSuggestionParams): Promise<IMutationResult<void>> {
  const response = await api.patch(`/admin/suggestions/${id}/status`, data)
  return { data: response.data, message: response.apiMessage ?? null }
}
