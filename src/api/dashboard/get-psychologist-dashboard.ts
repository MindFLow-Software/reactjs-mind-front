import { api } from '@/lib/axios'
import type { IDashboardRangeParams } from '@/types/dashboard/dashboard-range-params'
import type { IPsychologistDashboardData } from '@/types/dashboard/psychologist-dashboard-data'

export async function getPsychologistDashboard(
  params: IDashboardRangeParams,
): Promise<IPsychologistDashboardData> {
  const { period, startDate, endDate } = params
  const query =
    startDate && endDate ? { startDate, endDate } : { period: period ?? '30d' }

  const response = await api.get('/dashboard/psychologist', { params: query })

  return response.data
}
