import { api } from "@/lib/axios"

export interface GetMonthlySessionsCountRequest {
  startDate?: string
  endDate?: string
}

export interface GetMonthlySessionsCountResponse {
  count: number
}

export async function getMonthlySessionsCount({ startDate, endDate }: GetMonthlySessionsCountRequest) {
  const response = await api.get<GetMonthlySessionsCountResponse>(
    '/appointments/metrics/month-count',
    {
      params: { 
        startDate, 
        endDate 
      }
    }
  )

  return response.data
}