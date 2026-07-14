import { api } from '@/lib/axios'
import type {
  IAdminDashboardData,
  IDashboardRangeParams,
} from '@/types/dashboard'

export async function getAdminDashboard(
  params: IDashboardRangeParams,
): Promise<IAdminDashboardData> {
  const { period, startDate, endDate } = params
  const query =
    startDate && endDate ? { startDate, endDate } : { period: period ?? '30d' }

  const response = await api.get('/dashboard/admin', { params: query })

  return response.data
}
