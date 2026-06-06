import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { getAmountPatientsCard } from '@/api/patients/get-amount-patients-card'
import { getAmountPatientsChart } from '@/api/patients/get-amount-patients-chart'
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants'

export interface UsePatientsAmountReturn {
  total: number
  delta: number | null
  isLoading: boolean
  isError: boolean
}

export function usePatientsAmount(): UsePatientsAmountReturn {
  const now = useMemo(() => new Date(), [])

  const { data: cardData, isLoading: loadingTotal, isError } = useQuery({
    queryKey: ['dashboard', 'patients-total'],
    queryFn: getAmountPatientsCard,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  const { data: recentData, isLoading: loadingRecent } = useQuery({
    queryKey: ['dashboard', 'patients-recent-30d'],
    queryFn: () =>
      getAmountPatientsChart({
        startDate: startOfDay(subDays(now, 30)),
        endDate: endOfDay(now),
      }),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  const delta = useMemo(() => {
    if (!recentData) return null
    return recentData.reduce((acc, d) => acc + d.newPatients, 0)
  }, [recentData])

  return {
    total: cardData?.amount ?? 0,
    delta,
    isLoading: loadingTotal || loadingRecent,
    isError,
  }
}
