import type { AgeRangeItem, GenderItem } from '@/types/dashboard'
import type { IDashboardInsight } from '@/pages/app/dashboard/shared/types'

export interface ITimeSeriesPoint {
  date: string
  count: number
}

export interface IRegionStat {
  region: string
  count: number
}

export interface ISpecialtyStat {
  specialty: string
  count: number
}

export interface IAdminDashboardExecutive {
  sessions: number
  /** cents, formatted via `Currency.toBRL` */
  mrr: number
  psychologists: number
  patients: number
  clinics: number
  premium: number
  freemium: number
  conversionPercent: number
}

export interface IAdminDashboardGrowth {
  newPsychologists: ITimeSeriesPoint[]
  newPatients: ITimeSeriesPoint[]
  clinics: ITimeSeriesPoint[]
}

export interface IAdminDashboardRevenue {
  /** cents, formatted via `Currency.toBRL` */
  mrr: number
  premium: number
  freemium: number
  conversionPercent: number
  growthPercent: number
  churnPercent: number
}

export interface IAdminDashboardActivity {
  completed: number
  rescheduled: number
  canceled: number
  activeUsers: number
}

export interface IAdminDashboardPsychologists {
  byAge: AgeRangeItem[]
  byGender: GenderItem[]
  active: number
  inactive: number
  byState: IRegionStat[]
  specialties: ISpecialtyStat[]
}

export interface IAdminDashboardPatients {
  total: number
  byAge: AgeRangeItem[]
  byGender: GenderItem[]
  byRegion: IRegionStat[]
}

export interface IAdminDashboardData {
  executive: IAdminDashboardExecutive
  growth: IAdminDashboardGrowth
  revenue: IAdminDashboardRevenue
  activity: IAdminDashboardActivity
  psychologists: IAdminDashboardPsychologists
  patients: IAdminDashboardPatients
  suggestionsTotal: number
  insights: IDashboardInsight[]
}

export type { IDashboardInsight }
