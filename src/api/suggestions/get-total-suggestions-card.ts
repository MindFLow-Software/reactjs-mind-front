import { api } from "@/lib/axios"

export interface GetTotalSuggestionsResponse {
  total: number
}

export async function getTotalSuggestionsCard() {
  const response = await api.get<GetTotalSuggestionsResponse>(
    "/admin/metrics/suggestions/total"
  )
  return response.data
}