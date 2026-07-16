import type { IAgeRangeItem } from '@/types/dashboard/age-range-item'
import type { IDashboardAppointment } from '@/types/dashboard/dashboard-appointment'
import type { IDashboardGoal } from '@/types/dashboard/dashboard-goal'
import type { IDashboardInsight } from '@/types/dashboard/dashboard-insight'
import type { IGenderItem } from '@/types/dashboard/gender-item'
import type { ITimeSeriesPoint } from '@/types/dashboard/time-series-point'

export type IPsychologistDashboardData = {
  summary: {
    sessionsCompleted: number
    weeklyOccupancyPercent: number
    newPatients: number
    monthlyGoalProgressPercent: number
  }
  sessionsVolume: {
    completed: ITimeSeriesPoint[]
    cancelled: ITimeSeriesPoint[]
    rescheduled: ITimeSeriesPoint[]
  }
  sessionsStats: {
    growthPercent: number
    dailyAverage: number
  }
  attendance: {
    attendedCount: number
    cancelledCount: number
    rescheduledCount: number
  }
  analytics: {
    ageRange: IAgeRangeItem[]
    gender: IGenderItem[]
    weeklyOccupancyPercent: number
    retentionPercent: number
  }
  agenda: {
    today: IDashboardAppointment[]
    tomorrow: IDashboardAppointment[]
  }
  goals: IDashboardGoal[]
  insights: IDashboardInsight[]
}
