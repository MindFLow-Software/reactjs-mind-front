import { useQuery } from '@tanstack/react-query'
import { getPatients } from '@/api/patients/get-patients'
import type { PatientsMetrics } from '../patients-list.types'

export function usePatientsMetrics(): PatientsMetrics {
  const { data, isLoading } = useQuery({
    queryKey: ['patients-metrics'],
    queryFn: async () => {
      const [active, archived] = await Promise.all([
        getPatients({ pageIndex: 0, perPage: 1, status: 'ACTIVE' }),
        getPatients({ pageIndex: 0, perPage: 1, status: 'BLOCKED' }),
      ])
      return {
        activeCount:   active.meta.totalCount,
        archivedCount: archived.meta.totalCount,
      }
    },
    staleTime:            60_000,
    gcTime:              300_000,
    refetchOnWindowFocus: false,
  })

  return {
    activeCount:   data?.activeCount   ?? 0,
    archivedCount: data?.archivedCount ?? 0,
    isLoading,
  }
}
