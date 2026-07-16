import type { IPsychologistDashboardData } from '@/types/dashboard/psychologist-dashboard-data'

export type ISessionsVolume = IPsychologistDashboardData['sessionsVolume']

export type ISessionsStats = IPsychologistDashboardData['sessionsStats']

export type ISessionsVolumePoint = {
  date: string
  completed: number
  cancelled: number
  rescheduled: number
}
