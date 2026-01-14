import { api } from "@/lib/axios"

export interface UpdateSuggestionStatusParams {
  id: string
  status: "PENDING" | "OPEN" | "UNDER_REVIEW" | "IMPLEMENTED" | "REJECTED"
}

export async function updateSuggestionStatus({ id, status }: UpdateSuggestionStatusParams) {
  await api.patch(`/admin/suggestions/${id}/status`, { status })
}