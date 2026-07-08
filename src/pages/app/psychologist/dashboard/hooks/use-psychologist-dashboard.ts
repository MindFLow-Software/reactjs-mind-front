import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import {
  calcDailyAverage,
  calcSessionsGrowth,
  sumDailyCounts,
} from '@/pages/app/dashboard/shared/helpers'
import { type DashboardPeriod, PERIOD_DAYS } from '../constants'
import type { IDashboardGoal } from '@/pages/app/dashboard/shared/types'
import type { IPsychologistDashboardData } from '../types'
import { buildPsychologistMock } from '../mocks/psychologist-dashboard.mock'
import { useDashboardData } from './use-dashboard-data'
import { useSessionsBar } from './use-sessions-bar'
import { useTodayAppointments } from './use-today-appointments'
import { useWorkHours } from './use-work-hours'

export interface UsePsychologistDashboardReturn {
  data: IPsychologistDashboardData
  isLoading: boolean
  isError: boolean
  refetch: () => void
  period: DashboardPeriod
  setPeriod: (period: DashboardPeriod) => void
}

function toGoalProgressPercent(value: number, target: number): number {
  if (target === 0) return 0
  return Math.min(Math.round((value / target) * 100), 100)
}

export function usePsychologistDashboard(): UsePsychologistDashboardReturn {
  const queryClient = useQueryClient()
  const [period, setPeriod] = useState<DashboardPeriod>('30d')

  const dateRange = useMemo(() => {
    const end = new Date()
    return {
      startDate: startOfDay(subDays(end, PERIOD_DAYS[period])),
      endDate: endOfDay(end),
    }
  }, [period])

  const dashboard = useDashboardData()
  const sessionsBar = useSessionsBar(period)
  const todayAppointments = useTodayAppointments()
  const workHours = useWorkHours(dateRange)

  const mock = useMemo(() => buildPsychologistMock(period), [period])

  const data = useMemo<IPsychologistDashboardData>(() => {
    const completed = sessionsBar.data
    const sessionsCompleted = sumDailyCounts(completed)
    const newPatients = (dashboard.data?.newPatientsLast7Days ?? []).reduce(
      (total, item) => total + item.newPatients,
      0,
    )
    const activePatients = dashboard.data?.totalPatients ?? 0
    const hoursWorked = Math.round(workHours.totalMinutes / 60)

    const goals: IDashboardGoal[] = [
      {
        key: 'sessions',
        label: 'Sessões',
        value: sessionsCompleted,
        target: mock.goalTargets.sessions,
        unit: 'sessões',
      },
      {
        key: 'hours',
        label: 'Horas atendidas',
        value: hoursWorked,
        target: mock.goalTargets.hours,
        unit: 'h',
      },
      {
        key: 'active-patients',
        label: 'Pacientes ativos',
        value: activePatients,
        target: mock.goalTargets.activePatients,
        unit: 'pacientes',
      },
    ]

    return {
      summary: {
        sessionsCompleted,
        weeklyOccupancyPercent: mock.weeklyOccupancyPercent,
        newPatients,
        monthlyGoalProgressPercent: toGoalProgressPercent(
          sessionsCompleted,
          mock.goalTargets.sessions,
        ),
      },
      goals,
      sessionsVolume: {
        completed,
        cancelled: mock.sessionsVolume.cancelled,
        rescheduled: mock.sessionsVolume.rescheduled,
      },
      sessionsStats: {
        growthPercent: calcSessionsGrowth(completed),
        dailyAverage: calcDailyAverage(completed.map((point) => point.count)),
      },
      agenda: {
        today: todayAppointments.appointments,
        tomorrow: todayAppointments.tomorrowAppointments,
      },
      insights: mock.insights,
      attendance: mock.attendance,
      analytics: {
        ageRange: dashboard.data?.patientsByAge ?? [],
        gender: dashboard.data?.patientsByGender ?? [],
        weeklyOccupancyPercent: mock.weeklyOccupancyPercent,
        retentionPercent: mock.retentionPercent,
      },
    }
  }, [
    dashboard.data,
    sessionsBar.data,
    todayAppointments.appointments,
    todayAppointments.tomorrowAppointments,
    workHours.totalMinutes,
    mock,
  ])

  const isLoading =
    dashboard.isLoading ||
    sessionsBar.isLoading ||
    todayAppointments.isLoading ||
    workHours.isLoading

  const isError =
    dashboard.isError ||
    sessionsBar.isError ||
    todayAppointments.isError ||
    workHours.isError

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    sessionsBar.refetch()
  }, [queryClient, sessionsBar])

  return {
    data,
    isLoading,
    isError,
    refetch,
    period,
    setPeriod,
  }
}
