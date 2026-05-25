import { api } from "@/lib/axios"
import type { Suggestion } from "./get-suggestions"

export async function getMostVotedSuggestions() {
  const { data } = await api.get<Suggestion[]>(
    "/admin/metrics/suggestions/most-voted"
  )
  
  // Se o backend retornar o array direto, retorne 'data'
  // Se o backend retornar { suggestions: [...] }, retorne 'data.suggestions'
  return data
}