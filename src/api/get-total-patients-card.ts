import { api } from "@/lib/axios"

export interface GetTotalPatientsResponse {
  total: number
}

export async function getTotalPatientsCard() {
  const response = await api.get<GetTotalPatientsResponse>(
    "/admin/metrics/patients/total"
  )

  return response.data
}