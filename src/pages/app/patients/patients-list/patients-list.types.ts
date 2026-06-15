import type { Ipatient } from '@/types/patient'
import type { PaginationMeta } from '@/types/pagination'

type PatientStatus = 'ACTIVE' | 'REJECTED' | 'PENDING' | 'BLOCKED'

export interface StatusPillOption {
  value: PatientStatus | null
  label: string
  dot: string | null
  activeCls: string
}

export interface PatientsMetrics {
  activeCount: number
  archivedCount: number
  newPatientsCount: number
  isLoading: boolean
}

export interface PatientsListQueryResult {
  patients: Ipatient[]
  meta: PaginationMeta
  isLoading: boolean
  isFetching: boolean
}
