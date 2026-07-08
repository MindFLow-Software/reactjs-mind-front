import { useQuery } from '@tanstack/react-query'
import { fetchDashboardData } from '@/api/metrics/fetch-dashboard-data'
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants'

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetchDashboardData({}),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })
}
