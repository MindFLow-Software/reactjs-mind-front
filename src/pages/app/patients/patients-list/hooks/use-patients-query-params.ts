import type { IPatientsQueryParams } from '../patients-list.types'
import { usePatientFilters } from './use-patient-filters'

export function usePatientsQueryParams(): IPatientsQueryParams {
  const { filters } = usePatientFilters()

  return {
    pageIndex: filters.pageIndex,
    perPage: filters.perPage,
    filter: filters.filter,
    status: filters.status,
    gender: filters.gender,
    orderBy: filters.sortBy,
    order: filters.order,
  }
}
