import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getPsychologistDashboard } from '@/api/dashboard/get-psychologist-dashboard'
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from '@/pages/app/dashboard/shared/constants'
import type { DashboardPeriod } from '@/pages/app/dashboard/shared/types'
import type { IPsychologistDashboardData } from '@/types/dashboard'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

export interface IUsePsychologistDashboard {
  data?: IPsychologistDashboardData
  isLoading: boolean
  isError: boolean
  refetch: () => void
  period: DashboardPeriod
  setPeriod: (period: DashboardPeriod) => void
}

export function usePsychologistDashboard(): IUsePsychologistDashboard {
  const [period, setPeriod] = useState<DashboardPeriod>('30d')
  const practiceContextId = useActivePracticeContextStore(
    (state) => state.activePracticeContextId,
  )

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', 'psychologist', { period, practiceContextId }],
    queryFn: () => getPsychologistDashboard({ period }),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  return {
    data,
    isLoading,
    isError,
    refetch,
    period,
    setPeriod,
  }
}
