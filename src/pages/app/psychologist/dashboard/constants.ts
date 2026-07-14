import type { IDashboardPeriod } from '@/pages/app/dashboard/shared/types'

export const PERIOD_DAYS: Record<IDashboardPeriod, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  year: 365,
}

export const MONTHLY_GOAL_HOURS = 80

export const QUERY_STALE_TIME = 5 * 60 * 1000
export const QUERY_GC_TIME = 10 * 60 * 1000
