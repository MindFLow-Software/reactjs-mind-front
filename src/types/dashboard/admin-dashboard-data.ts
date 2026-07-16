import type { IAgeRangeItem } from '@/types/dashboard/age-range-item'
import type { IDashboardInsight } from '@/types/dashboard/dashboard-insight'
import type { IGenderItem } from '@/types/dashboard/gender-item'
import type { IRegionStat } from '@/types/dashboard/region-stat'
import type { ISpecialtyStat } from '@/types/dashboard/specialty-stat'
import type { ITimeSeriesPoint } from '@/types/dashboard/time-series-point'

export type IAdminDashboardData = {
  executive: {
    psychologists: number
    patients: number
    sessions: number
    clinics: number
    mrr: number
    premium: number
    freemium: number
    conversionPercent: number
  }
  growth: {
    newPsychologists: ITimeSeriesPoint[]
    newPatients: ITimeSeriesPoint[]
    clinics: ITimeSeriesPoint[]
  }
  revenue: {
    mrr: number
    premium: number
    freemium: number
    conversionPercent: number
    growthPercent: number
    churnPercent: number
  }
  activity: {
    completed: number
    rescheduled: number
    canceled: number
    activeUsers: number
  }
  psychologists: {
    byAge: IAgeRangeItem[]
    byGender: IGenderItem[]
    active: number
    inactive: number
    byState: IRegionStat[]
    specialties: ISpecialtyStat[]
  }
  patients: {
    total: number
    byAge: IAgeRangeItem[]
    byGender: IGenderItem[]
    byRegion: IRegionStat[]
  }
  suggestionsTotal: number
  insights: IDashboardInsight[]
}
