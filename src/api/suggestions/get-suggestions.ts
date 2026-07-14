import { api } from '@/lib/axios'
import type { ISuggestion } from '@/types/suggestion/suggestion'

interface GetSuggestionsParams {
  category?: string
  status?: string | string[]
  sortBy?: string
  search?: string
}

export async function getSuggestions(params: GetSuggestionsParams) {
  const response = await api.get<{ suggestions: ISuggestion[] }>(
    '/suggestions',
    {
      params: {
        category: params.category,
        status: params.status,
        sortBy: params.sortBy,
        search: params.search,
      },
    },
  )
  return response.data.suggestions
}
