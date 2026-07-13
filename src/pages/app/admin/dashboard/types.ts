import type {
  IAdminDashboardData,
  IDashboardInsight,
  IRegionStat,
  ISpecialtyStat,
  ITimeSeriesPoint,
} from '@/types/dashboard'

export type IAdminDashboardExecutive = IAdminDashboardData['executive']
export type IAdminDashboardGrowth = IAdminDashboardData['growth']
export type IAdminDashboardRevenue = IAdminDashboardData['revenue']
export type IAdminDashboardActivity = IAdminDashboardData['activity']
export type IAdminDashboardPsychologists = IAdminDashboardData['psychologists']
export type IAdminDashboardPatients = IAdminDashboardData['patients']

export type {
  IAdminDashboardData,
  IDashboardInsight,
  IRegionStat,
  ISpecialtyStat,
  ITimeSeriesPoint,
}
