import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTotalWorkHours } from '@/api/metrics/get-total-work-hours'
import { MONTHLY_GOAL_HOURS, QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants'

export interface UseWorkHoursOptions {
  startDate?: Date
  endDate?: Date
}

export interface UseWorkHoursReturn {
  totalMinutes: number
  progressPct: number
  atGoal: boolean
  isLoading: boolean
  isError: boolean
}

export function useWorkHours({
  startDate,
  endDate,
}: UseWorkHoursOptions = {}): UseWorkHoursReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'dashboard',
      'work-hours',
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () => getTotalWorkHours(startDate, endDate),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  const { progressPct, atGoal } = useMemo(() => {
    const hoursWorked = data ? data.totalMinutes / 60 : 0
    return {
      progressPct: Math.min((hoursWorked / MONTHLY_GOAL_HOURS) * 100, 100),
      atGoal: hoursWorked >= MONTHLY_GOAL_HOURS,
    }
  }, [data])

  return {
    totalMinutes: data?.totalMinutes ?? 0,
    progressPct,
    atGoal,
    isLoading,
    isError,
  }
}
