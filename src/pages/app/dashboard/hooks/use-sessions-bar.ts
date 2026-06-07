import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { getDailySessionsMetrics } from '@/api/metrics/get-daily-sessions-metrics'
import { type DashboardPeriod, PERIOD_DAYS, QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants'

export interface UseSessionsBarReturn {
  data: Awaited<ReturnType<typeof getDailySessionsMetrics>>
  subtitleLabel: string
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useSessionsBar(period: DashboardPeriod): UseSessionsBarReturn {
  const { startDateToFetch, endDateToFetch, subtitleLabel } = useMemo(() => {
    const ref = new Date()
    const days = PERIOD_DAYS[period]
    const label = period === 'year' ? 'Último ano' : `Últimos ${days} dias`
    return {
      startDateToFetch: startOfDay(subDays(ref, days)),
      endDateToFetch: endOfDay(ref),
      subtitleLabel: label,
    }
  }, [period])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      'daily-sessions-bar',
      startDateToFetch.toISOString(),
      endDateToFetch.toISOString(),
    ],
    queryFn: () =>
      getDailySessionsMetrics(
        startDateToFetch.toISOString(),
        endDateToFetch.toISOString(),
      ),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  return {
    data: data ?? [],
    subtitleLabel,
    isLoading,
    isError,
    refetch,
  }
}
