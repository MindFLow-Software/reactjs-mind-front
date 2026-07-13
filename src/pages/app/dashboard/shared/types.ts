export type DashboardPeriod = '7d' | '30d' | '90d' | 'year'

export interface PeriodOption {
  value: DashboardPeriod
  label: string
}
