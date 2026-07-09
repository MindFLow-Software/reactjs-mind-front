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
  isError: boolean
  isLoading: boolean
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
  isError: boolean
  isLoading: boolean
  newPsychologists: ITimeSeriesPoint[]
  newPatients: ITimeSeriesPoint[]
  clinics: ITimeSeriesPoint[]
}

export interface IAdminDashboardRevenue {
  isError: boolean
  isLoading: boolean
  /** cents, formatted via `Currency.toBRL` */
  mrr: number
  premium: number
  freemium: number
  conversionPercent: number
  growthPercent: number
  churnPercent: number
}

export interface IAdminDashboardActivity {
  isError: boolean
  isLoading: boolean
  completed: number
  rescheduled: number
  canceled: number
  activeUsers: number
}

export interface IAdminDashboardPsychologists {
  isError: boolean
  isLoading: boolean
  byAge: AgeRangeItem[]
  byGender: GenderItem[]
  active: number
  inactive: number
  byState: IRegionStat[]
  specialties: ISpecialtyStat[]
}

export interface IAdminDashboardPatients {
  isError: boolean
  isLoading: boolean
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
