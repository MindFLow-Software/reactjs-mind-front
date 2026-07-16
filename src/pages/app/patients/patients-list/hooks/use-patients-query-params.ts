import { STATUS_TO_IS_ACTIVE } from '../constants'
import type { IPatientsQueryParams } from '../patients-list.types'
import { usePatientFilters } from './use-patient-filters'

export function usePatientsQueryParams(): IPatientsQueryParams {
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
