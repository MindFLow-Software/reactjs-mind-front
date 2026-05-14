import { api } from '@/lib/axios'
import type { DashboardResponse, GetDashboardParams } from '@/contracts/types'

export type { DashboardResponse } from '@/contracts/types'

export interface FetchDashboardParams {
  startDate?: Date
  endDate?: Date
}

export async function fetchDashboardData(
  params: FetchDashboardParams,
): Promise<DashboardResponse> {
  const queryParams: GetDashboardParams = {
    ...(params.startDate && { startDate: params.startDate.toISOString() }),
    ...(params.endDate && { endDate: params.endDate.toISOString() }),
  }

  const response = await api.get<DashboardResponse>('/dashboard', {
    params: queryParams,
  })

  return response.data
}
