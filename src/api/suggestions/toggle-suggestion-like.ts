import { api } from "@/lib/axios"

export async function toggleSuggestionLike(suggestionId: string) {
  await api.patch(`/suggestions/${suggestionId}/like`)
}