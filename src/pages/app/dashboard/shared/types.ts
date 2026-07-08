import type { AgeRangeItem, GenderItem } from '@/types/dashboard'

export type DashboardPeriod = '7d' | '30d' | '90d' | 'year'

export interface PeriodOption {
  value: DashboardPeriod
  label: string
}

export enum InsightSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

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
