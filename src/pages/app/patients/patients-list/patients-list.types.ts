import type { IPaginationMeta } from '@/types/shared/pagination-meta'
import type { IPatient } from '@/types/patient/patient'

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
  patients: IPatient[]
  meta: IPaginationMeta
  isLoading: boolean
  isFetching: boolean
}
