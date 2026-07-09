import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/hooks/use-auth'
import { buildPatientMock } from '../mocks/patient-dashboard.mock'
import type { IPatientDashboardData } from '../types'

export interface UsePatientDashboardReturn {
  data: IPatientDashboardData
  hasPatientProfile: boolean
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

const EMPTY_DATA: IPatientDashboardData = {
  patientName: '',
  nextSession: null,
  goals: [],
  journal: [],
  psychologists: [],
}

export function usePatientDashboard(): UsePatientDashboardReturn {
  const queryClient = useQueryClient()
  const { profile, isPending, isError } = useAuth()

  const patientProfile = profile?.patientProfiles[0]
  const hasPatientProfile = Boolean(patientProfile)

  const data = useMemo<IPatientDashboardData>(() => {
    if (!profile || !patientProfile) {
      return EMPTY_DATA
    }

    const mock = buildPatientMock(patientProfile)

    return {
      patientName: `${profile.firstName} ${profile.lastName}`,
      nextSession: mock.nextSession,
      goals: mock.goals,
      journal: mock.journal,
      psychologists: mock.psychologists,
    }
  }, [profile, patientProfile])

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['profile'] })
  }, [queryClient])

  return {
    data,
    hasPatientProfile,
    isLoading: isPending,
    isError,
    refetch,
  }
}
