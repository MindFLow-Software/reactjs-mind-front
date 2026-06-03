import { usePatientFilters } from '@/hooks/use-patient-filters'
import type { PatientStatus, Gender, IsessionVolume } from '@/types/patient'

export interface PatientsQueryParams {
  pageIndex: number
  perPage: number
  filter?: string
  status?: PatientStatus
  gender?: Gender
  sessionVolume?: IsessionVolume
  order: 'asc' | 'desc'
}

export function usePatientsQueryParams(): PatientsQueryParams {
  const { filters } = usePatientFilters()

  return {
    pageIndex: filters.pageIndex,
    perPage:   filters.perPage,
    order:     filters.order,
    ...(filters.filter                                              ? { filter: filters.filter }               : {}),
    ...(filters.status                                              ? { status: filters.status }               : {}),
    ...(filters.gender                                              ? { gender: filters.gender }               : {}),
    ...(filters.sessionVolume && filters.sessionVolume !== 'all'   ? { sessionVolume: filters.sessionVolume } : {}),
  }
}
