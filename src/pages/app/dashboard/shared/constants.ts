import type { DashboardPeriod, PeriodOption } from './types'

export const PERIODS: readonly PeriodOption[] = [
  { value: '7d' as DashboardPeriod, label: '7 dias' },
  { value: '30d' as DashboardPeriod, label: '30 dias' },
  { value: '90d' as DashboardPeriod, label: '90 dias' },
  { value: 'year' as DashboardPeriod, label: 'Ano' },
] as const

export const ADMIN_PERIODS: readonly PeriodOption[] = [
  { value: '7d' as DashboardPeriod, label: '7 dias' },
  { value: '30d' as DashboardPeriod, label: '30 dias' },
  { value: '90d' as DashboardPeriod, label: '90 dias' },
  { value: 'year' as DashboardPeriod, label: '1 ano' },
] as const

export const PERIOD_DAYS: Record<DashboardPeriod, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  year: 365,
}

export const MONTHLY_GOAL_HOURS = 80

export const QUERY_STALE_TIME = 5 * 60 * 1000
export const QUERY_GC_TIME = 10 * 60 * 1000
