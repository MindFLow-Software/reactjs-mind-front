import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { getMonthlySessionsCount } from '@/api/metrics/get-monthly-sessions-count'
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants'

export interface UseSessionsCountOptions {
  startDate: Date | undefined
  endDate: Date | undefined
}

export interface UseSessionsCountReturn {
  count: number
  pct: string | null
  isPositive: boolean
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useSessionsCount({
  startDate,
  endDate,
}: UseSessionsCountOptions): UseSessionsCountReturn {
  const now = useMemo(() => new Date(), [])
  const prevStart = useMemo(() => startOfDay(subDays(now, 60)), [now])
  const prevEnd = useMemo(() => endOfDay(subDays(now, 30)), [now])

  const {
    data: current,
    isLoading: loadingCurrent,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'dashboard',
      'month-sessions-current',
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () =>
      getMonthlySessionsCount({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      }),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  const { data: previous, isLoading: loadingPrev } = useQuery({
    queryKey: [
      'dashboard',
      'month-sessions-prev',
      prevStart.toISOString(),
      prevEnd.toISOString(),
    ],
    queryFn: () =>
      getMonthlySessionsCount({
        startDate: prevStart.toISOString(),
        endDate: prevEnd.toISOString(),
      }),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  const { pct, isPositive } = useMemo(() => {
    const curr = current?.count ?? 0
    const prev = previous?.count ?? 0
    if (prev === 0 || !previous) return { pct: null, isPositive: true }
    const diff = ((curr - prev) / prev) * 100
    return { pct: Math.abs(diff).toFixed(0), isPositive: diff >= 0 }
  }, [current, previous])

  return {
    count: current?.count ?? 0,
    pct,
    isPositive,
    isLoading: loadingCurrent || loadingPrev,
    isError,
    refetch,
  }
}
