import { useQuery } from '@tanstack/react-query'
import { getPatients } from '@/api/patients/get-patients'
import type { PatientsListQueryResult } from '../patients-list.types'
import { usePatientsQueryParams } from './use-patients-query-params'

const DEFAULT_META = { pageIndex: 0, perPage: 10, totalCount: 0 }

export function usePatientsListQuery(): PatientsListQueryResult {
  const params = usePatientsQueryParams()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['patients', params],
    queryFn: () => getPatients(params),
    refetchOnWindowFocus: true,
  })

  return {
    patients: data?.patients ?? [],
    meta: data?.meta ?? DEFAULT_META,
    isLoading,
    isFetching,
  }
}
