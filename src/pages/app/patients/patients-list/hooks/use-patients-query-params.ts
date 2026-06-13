import { usePatientFilters } from '@/hooks/use-patient-filters'
import type { PatientSortBy } from '@/hooks/use-patient-filters'
import type { Gender } from '@/types/patient'

const STATUS_TO_IS_ACTIVE: Record<string, boolean> = {
  ACTIVE: true,
  BLOCKED: false,
}

export interface IpatientsQueryParams {
  pageIndex: number
  perPage: number
  filter?: string
  isActive?: boolean
  gender?: Gender | null
  orderBy?: PatientSortBy
  order: 'asc' | 'desc'
}

export function usePatientsQueryParams(): IpatientsQueryParams {
  const { filters } = usePatientFilters()

  const isActive =
    filters.status != null ? STATUS_TO_IS_ACTIVE[filters.status] : undefined

  return {
    pageIndex: filters.pageIndex,
    perPage: filters.perPage,
    filter: filters.filter,
    isActive,
    gender: filters.gender,
    orderBy: filters.sortBy,
    order: filters.order,
  }
}
