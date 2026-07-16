import { useQuery } from '@tanstack/react-query'
import { fetchPatientProfiles } from '@/api/patient-profiles/fetch-patient-profiles'
import { queryKeys } from '@/constants/query-keys'
import { filterAndSortPatients } from '../patients-list.helpers'
import type { IPatientsListQueryResult } from '../patients-list.types'
import { usePatientsQueryParams } from './use-patients-query-params'

const DEFAULT_META = { pageIndex: 0, perPage: 10, totalCount: 0 }

export function usePatientsListQuery(): IPatientsListQueryResult {
  const params = usePatientsQueryParams()
  const { pageIndex, perPage } = params

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.patients({ pageIndex, perPage }),
    queryFn: () => fetchPatientProfiles({ pageIndex, perPage }),
    refetchOnWindowFocus: true,
  })

  return {
    patients: filterAndSortPatients(data?.patients ?? [], params),
    meta: data?.meta ?? DEFAULT_META,
    isLoading,
    isFetching,
  }
}
