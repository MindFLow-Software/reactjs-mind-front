import type { PatientStatus, Ipatient } from '@/types/patient'
import type { PaginationMeta } from '@/types/pagination'

export interface MetricCardProps {
  icon: React.ReactNode
  iconBg: string
  value: number | string
  label: string
  sub?: string
  subTrend?: 'up' | 'neutral'
  isLoading?: boolean
}

export interface StatusPillOption {
  value: PatientStatus | null
  label: string
  dot: string | null
  activeCls: string
}

export interface PatientsMetrics {
  activeCount: number
  archivedCount: number
  isLoading: boolean
}

export interface PatientsListQueryResult {
  patients: Ipatient[]
  meta: PaginationMeta
  isLoading: boolean
  isFetching: boolean
}
