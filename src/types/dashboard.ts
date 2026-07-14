import type { AppointmentStatus } from '@/types/appointment/appointment-status'
import type {
  Expertise,
  Gender,
  InsightSeverity,
  SessionModality,
} from '@/types/shared/enums'
import type { DashboardPeriod } from '@/pages/app/dashboard/shared/types'

export type AgeRangeLabel = '0-17' | '18-25' | '26-35' | '36-50' | '51+'

export interface IAgeRangeItem {
  range: AgeRangeLabel
  count: number
}

export interface IGenderItem {
  gender: Gender
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

export interface ITimeSeriesPoint {
  date: string
  value: number
}

export interface IDashboardInsight {
  severity: InsightSeverity
  title: string
  description: string
}

export interface IDashboardGoal {
  label: string
  current: number
  target: number
  percent: number
}

export type DashboardGoalLabel = 'sessions' | 'hours' | 'active-patients'

export interface IDashboardRangeParams {
  period?: DashboardPeriod
  startDate?: string
  endDate?: string
}

export interface IAdminDashboardData {
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

export interface IDashboardAppointment {
  id: string
  patientProfileId: string | null
  patientName: string
  psychologistName: string
  scheduledAt: string
  durationInMin: number
  status: AppointmentStatus
  diagnosis: string
}

export interface IPsychologistDashboardData {
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

export interface IPsychologistGoalSettings {
  monthlySessionsTarget: number
  monthlyHoursTarget: number
  activePatientsTarget: number
}

export type IUpdatePsychologistGoalsBody = IPsychologistGoalSettings

export interface IPatientNextSession {
  id: string
  scheduledAt: string
  psychologistName: string
  psychologistAvatarUrl: string | null
  durationMinutes: number
  modality: SessionModality
}

export interface IPatientPsychologistCard {
  psychologistProfileId: string
  psychologistPracticeContextId: string | null
  professionalName: string
  avatarUrl: string | null
  specialty: Expertise
  pricePerSession: number
  rating: number
  isLinked: boolean
}

export interface IPatientDashboardInner {
  patientName: string
  nextSession: IPatientNextSession | null
  goals: unknown[]
  journal: unknown[]
  psychologists: IPatientPsychologistCard[]
}

export interface IPatientDashboardPayload {
  hasPatientProfile: boolean
  data: IPatientDashboardInner
}
