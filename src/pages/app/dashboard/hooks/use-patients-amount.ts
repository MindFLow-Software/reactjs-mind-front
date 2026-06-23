import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { getDashboardMetrics } from '@/api/patient-profiles/get-dashboard-metrics'
import { getNewPatientProfilesAmount } from '@/api/patient-profiles/get-new-patient-profiles-amount'
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants'

export interface UsePatientsAmountReturn {
  total: number
  delta: number | null
  isLoading: boolean
  isError: boolean
}

export function usePatientsAmount(): UsePatientsAmountReturn {
  const now = useMemo(() => new Date(), [])

  const [totalQuery, recentQuery] = useQueries({
    queries: [
      {
        queryKey: ['dashboard', 'patients-total'],
        queryFn: getDashboardMetrics,
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_GC_TIME,
      },
      {
        queryKey: ['dashboard', 'patients-recent-30d'],
        queryFn: () =>
          getNewPatientProfilesAmount({
            startDate: startOfDay(subDays(now, 30)),
            endDate: endOfDay(now),
          }),
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_GC_TIME,
      },
    ],
  })

  const delta = useMemo(() => {
    if (!recentQuery.data) return null
    return recentQuery.data.reduce((acc, d) => acc + d.newPatients, 0)
  }, [recentQuery.data])

  return {
    total: totalQuery.data?.activePatients ?? 0,
    delta,
    isLoading: totalQuery.isLoading || recentQuery.isLoading,
    isError: totalQuery.isError || recentQuery.isError,
  }
}
