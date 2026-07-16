import type { IDashboardPeriod } from '@/pages/app/dashboard/shared/types'

export type IDashboardRangeParams = {
  period?: IDashboardPeriod
  startDate?: string
  endDate?: string
}
