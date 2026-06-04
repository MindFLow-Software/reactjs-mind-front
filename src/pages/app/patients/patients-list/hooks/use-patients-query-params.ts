import { usePatientFilters } from '@/hooks/use-patient-filters'
import type { PatientStatus, Gender } from '@/types/patient'

export interface IpatientsQueryParams {
  pageIndex: number
  perPage: number
  filter?: string
  status?: PatientStatus | null
  gender?: Gender | null
  order: 'asc' | 'desc'
}

export function usePatientsQueryParams(): IpatientsQueryParams {
  const { filters } = usePatientFilters()

  return {
    pageIndex: filters.pageIndex,
    perPage: filters.perPage,
    order: filters.order,
    filter: filters.filter,
    status: filters.status,
    gender: filters.gender,
  }
}
