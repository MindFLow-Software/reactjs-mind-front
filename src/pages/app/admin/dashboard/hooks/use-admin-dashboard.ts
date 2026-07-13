import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getAdminDashboard } from '@/api/dashboard/get-admin-dashboard'
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from '@/pages/app/dashboard/shared/constants'
import type { DashboardPeriod } from '@/pages/app/dashboard/shared/types'
import type { IAdminDashboardData } from '@/types/dashboard'

export interface IUseAdminDashboard {
  data?: IAdminDashboardData
  isLoading: boolean
  isError: boolean
  refetch: () => void
  period: DashboardPeriod
  setPeriod: (period: DashboardPeriod) => void
}

export function useAdminDashboard(): IUseAdminDashboard {
  const [period, setPeriod] = useState<DashboardPeriod>('30d')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', 'admin', { period }],
    queryFn: () => getAdminDashboard({ period }),
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
