import type { AgeRangeItem, GenderItem } from '@/types/dashboard'
import { InsightSeverity } from '@/types/enums'

export type DashboardPeriod = '7d' | '30d' | '90d' | 'year'

export interface PeriodOption {
  value: DashboardPeriod
  label: string
}

export { InsightSeverity }

export interface IDashboardInsight {
  id: string
  severity: InsightSeverity
  title: string
  description: string
  actionLabel?: string
}

export interface IDashboardGoal {
  key: string
  label: string
  value: number
  target: number
  unit?: string
}

export type { AgeRangeItem, GenderItem }
