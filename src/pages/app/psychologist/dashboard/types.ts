import type { AgeRangeItem, GenderItem } from '@/types/dashboard'
import type { IAppointmentWithNames } from '@/types/appointment'
import type { DailySessionMetric } from '@/api/metrics/get-daily-sessions-metrics'
import type {
  IDashboardGoal,
  IDashboardInsight,
} from '@/pages/app/dashboard/shared/types'

export interface IPsychologistDashboardSummary {
  sessionsCompleted: number
  weeklyOccupancyPercent: number
  newPatients: number
  monthlyGoalProgressPercent: number
}

export interface IPsychologistDashboardSessionsVolume {
  completed: DailySessionMetric[]
  cancelled: DailySessionMetric[]
  rescheduled: DailySessionMetric[]
}

export interface IPsychologistDashboardSessionsStats {
  growthPercent: number
  dailyAverage: number
}

export interface IPsychologistDashboardAgenda {
  today: IAppointmentWithNames[]
  tomorrow: IAppointmentWithNames[]
}

export interface IPsychologistDashboardAttendance {
  attendedCount: number
  cancelledCount: number
  rescheduledCount: number
}

export interface IPsychologistDashboardAnalytics {
  ageRange: AgeRangeItem[]
  gender: GenderItem[]
  weeklyOccupancyPercent: number
  retentionPercent: number
}

export interface IPsychologistDashboardData {
  summary: IPsychologistDashboardSummary
  goals: IDashboardGoal[]
  sessionsVolume: IPsychologistDashboardSessionsVolume
  sessionsStats: IPsychologistDashboardSessionsStats
  agenda: IPsychologistDashboardAgenda
  insights: IDashboardInsight[]
  attendance: IPsychologistDashboardAttendance
  analytics: IPsychologistDashboardAnalytics
}
