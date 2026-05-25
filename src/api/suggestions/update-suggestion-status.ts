import { api } from "@/lib/axios"

interface UpdateSuggestionParams {
  id: string
  status?: string
  title?: string       
  category?: string    
  description?: string 
}

export async function updateSuggestionStatus({ id, ...data }: UpdateSuggestionParams) {
  await api.patch(`/admin/suggestions/${id}/status`, data)
}