import { api } from "@/lib/axios"

export interface DailySessionMetric {
  date: string // ISO Date
  count: number
}

export async function getDailySessionsMetrics(startDate?: string, endDate?: string) {
  const response = await api.get<DailySessionMetric[]>('/appointments/metrics/daily-count', {
    params: { startDate, endDate }
  })
  return response.data
}