export type DashboardPeriod = '7d' | '30d' | '90d' | 'year'

export const PERIOD_DAYS: Record<DashboardPeriod, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  year: 365,
}

export const MONTHLY_GOAL_HOURS = 80

export const QUERY_STALE_TIME = 5 * 60 * 1000
export const QUERY_GC_TIME = 10 * 60 * 1000
