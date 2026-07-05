import { api } from '@/lib/axios'
import type { ISuggestion } from '@/types/suggestion'

export async function getMostVotedSuggestions() {
  const { data } = await api.get<ISuggestion[]>(
    '/admin/metrics/suggestions/most-voted',
  )

  // Se o backend retornar o array direto, retorne 'data'
  // Se o backend retornar { suggestions: [...] }, retorne 'data.suggestions'
  return data
}
