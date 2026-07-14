import { useQuery } from '@tanstack/react-query'

import { getPatientDashboard } from '@/api/dashboard/get-patient-dashboard'
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from '@/pages/app/dashboard/shared/constants'
import type { IPatientDashboardInner } from '@/types/dashboard'

export interface IUsePatientDashboard {
  data: IPatientDashboardInner
  hasPatientProfile: boolean
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

const EMPTY_DATA: IPatientDashboardInner = {
  patientName: '',
  nextSession: null,
  goals: [],
  journal: [],
  psychologists: [],
}

export function usePatientDashboard(): IUsePatientDashboard {
  const {
    data: payload,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['dashboard', 'patient'],
    queryFn: () => getPatientDashboard(),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  const hasPatientProfile = payload?.hasPatientProfile ?? false

  return {
    data: hasPatientProfile && payload ? payload.data : EMPTY_DATA,
    hasPatientProfile,
    isLoading,
    isError,
    refetch,
  }
}
