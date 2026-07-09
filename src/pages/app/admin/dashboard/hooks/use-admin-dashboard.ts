import { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { subDays, startOfDay, endOfDay } from 'date-fns'

import { getTotalPsychologists } from '@/api/psychologists/get-total-psychologists'
import { getTotalPatientsCard } from '@/api/metrics/get-total-patients-card'
import { getTotalSuggestionsCard } from '@/api/suggestions/get-total-suggestions-card'
import {
  getNewPsychologistsCount,
  type PsychologistsChartData,
} from '@/api/psychologists/get-new-psychologists-count'
import {
  getTotalPatientsAdminChart,
  type NewPatientsChartData,
} from '@/api/metrics/get-total-patients-admin-chart'
import {
  getPsychologistsAgeStats,
  type IPsychologistAgeStats,
} from '@/api/metrics/get-psychologists-age-stats'
import {
  getPsychologistsGenderStats,
  type PsychologistGenderStats,
} from '@/api/psychologists/get-psychologists-gender-stats'
import {
  PERIOD_DAYS,
  QUERY_STALE_TIME,
  QUERY_GC_TIME,
} from '@/pages/app/dashboard/shared/constants'
import type { DashboardPeriod } from '@/pages/app/dashboard/shared/types'
import type { AgeRange, AgeRangeItem, GenderItem } from '@/types/dashboard'
import type { Gender } from '@/types/enums'
import { buildAdminMock } from '../mocks/admin-dashboard.mock'
import type { IAdminDashboardData, ITimeSeriesPoint } from '../types'

export interface UseAdminDashboardReturn {
  data: IAdminDashboardData
  isLoading: boolean
  isError: boolean
  refetch: () => void
  period: DashboardPeriod
  setPeriod: (period: DashboardPeriod) => void
}

function mapNewPsychologists(
  items: PsychologistsChartData[],
): ITimeSeriesPoint[] {
  return items.map((item) => ({
    date: item.date,
    count: item.newPsychologists,
  }))
}

function mapNewPatients(items: NewPatientsChartData[]): ITimeSeriesPoint[] {
  return items.map((item) => ({ date: item.date, count: item.newPatients }))
}

function mapAgeStats(items: IPsychologistAgeStats[]): AgeRangeItem[] {
  return items.map((item) => ({
    range: item.ageRange as AgeRange,
    count: item.count,
  }))
}

function mapGenderStats(items: PsychologistGenderStats[]): GenderItem[] {
  return items.map((item) => ({
    gender: item.gender as Gender,
    count: item.count,
  }))
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const queryClient = useQueryClient()
  const [period, setPeriod] = useState<DashboardPeriod>('30d')

  const dateRange = useMemo(() => {
    const end = new Date()
    return {
      startDate: startOfDay(subDays(end, PERIOD_DAYS[period])),
      endDate: endOfDay(end),
    }
  }, [period])

  const queryDefaults = {
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  }

  const totalPsychologists = useQuery({
    queryKey: ['admin', 'psychologists-total'],
    queryFn: getTotalPsychologists,
    ...queryDefaults,
  })

  const totalPatients = useQuery({
    queryKey: ['admin', 'patients-total'],
    queryFn: getTotalPatientsCard,
    ...queryDefaults,
  })

  const totalSuggestions = useQuery({
    queryKey: ['admin', 'suggestions-total'],
    queryFn: getTotalSuggestionsCard,
    ...queryDefaults,
  })

  const newPsychologists = useQuery({
    queryKey: ['admin', 'psychologists-new', dateRange],
    queryFn: () =>
      getNewPsychologistsCount({
        from: dateRange.startDate,
        to: dateRange.endDate,
      }),
    initialData: [],
    ...queryDefaults,
  })

  const newPatients = useQuery({
    queryKey: ['admin', 'patients-new', dateRange],
    queryFn: () =>
      getTotalPatientsAdminChart({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
    initialData: [],
    ...queryDefaults,
  })

  const ageStats = useQuery({
    queryKey: ['admin', 'psychologists-age-stats'],
    queryFn: getPsychologistsAgeStats,
    initialData: [],
    ...queryDefaults,
  })

  const genderStats = useQuery({
    queryKey: ['admin', 'psychologists-gender-stats'],
    queryFn: getPsychologistsGenderStats,
    initialData: [],
    ...queryDefaults,
  })

  const mock = useMemo(() => buildAdminMock(period), [period])

  const data = useMemo<IAdminDashboardData>(() => {
    const psychologistsTotal = totalPsychologists.data?.total ?? 0
    const patientsTotal = totalPatients.data?.total ?? 0

    return {
      executive: {
        psychologists: psychologistsTotal,
        patients: patientsTotal,
        sessions: mock.executive.sessions,
        mrr: mock.executive.mrr,
        clinics: mock.executive.clinics,
        premium: mock.executive.premium,
        freemium: mock.executive.freemium,
        conversionPercent: mock.executive.conversionPercent,
      },
      growth: {
        newPsychologists: mapNewPsychologists(newPsychologists?.data),
        newPatients: mapNewPatients(newPatients?.data),
        clinics: mock.growth.clinics,
      },
      revenue: mock.revenue,
      activity: mock.activity,
      psychologists: {
        byAge: mapAgeStats(ageStats?.data),
        byGender: mapGenderStats(genderStats?.data),
        active: mock.psychologists.active,
        inactive: mock.psychologists.inactive,
        byState: mock.psychologists.byState,
        specialties: mock.psychologists.specialties,
      },
      patients: {
        total: patientsTotal,
        byAge: mock.patients.byAge,
        byGender: mock.patients.byGender,
        byRegion: mock.patients.byRegion,
      },
      suggestionsTotal: totalSuggestions.data?.total ?? 0,
      insights: mock.insights,
    }
  }, [
    totalPsychologists.data,
    totalPatients.data,
    totalSuggestions.data,
    newPsychologists.data,
    newPatients.data,
    ageStats.data,
    genderStats.data,
    mock,
  ])

  const isLoading =
    totalPsychologists.isLoading ||
    totalPatients.isLoading ||
    totalSuggestions.isLoading ||
    newPsychologists.isLoading ||
    newPatients.isLoading ||
    ageStats.isLoading ||
    genderStats.isLoading

  const isError =
    totalPsychologists.isError ||
    totalPatients.isError ||
    totalSuggestions.isError ||
    newPsychologists.isError ||
    newPatients.isError ||
    ageStats.isError ||
    genderStats.isError

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin'] })
  }, [queryClient])

  return {
    data,
    isLoading,
    isError,
    refetch,
    period,
    setPeriod,
  }
}
