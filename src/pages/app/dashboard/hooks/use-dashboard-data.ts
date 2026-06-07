import { useQuery } from '@tanstack/react-query'
import { fetchDashboardData } from '@/api/metrics/fetch-dashboard-data'

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetchDashboardData({}),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
