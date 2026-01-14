import { api } from "@/lib/axios"

export interface GetTotalPsychologistsResponse {
  total: number
}

export async function getTotalPsychologists() {
  const response = await api.get<GetTotalPsychologistsResponse>(
    "/admin/metrics/psychologists/total"
  )

  return response.data
}