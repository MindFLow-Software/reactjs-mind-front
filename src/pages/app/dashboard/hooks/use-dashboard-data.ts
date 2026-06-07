import { useQuery } from '@tanstack/react-query'
import {
  fetchDashboardData,
  type DashboardResponse,
} from '@/api/metrics/fetch-dashboard-data'
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants'

export interface UseDashboardDataReturn {
  data: DashboardResponse | undefined
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useDashboardData(): UseDashboardDataReturn {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetchDashboardData({}),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })
  return { data, isLoading, isError, refetch }
}
