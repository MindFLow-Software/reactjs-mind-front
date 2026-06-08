import { useQuery } from '@tanstack/react-query'
import { getPatients } from '@/api/patients/get-patients'
import { getAmountPatientsCard } from '@/api/patients/get-amount-patients-card'
import type { PatientsMetrics } from '../patients-list.types'

export function usePatientsMetrics(): PatientsMetrics {
  const { data, isLoading } = useQuery({
    queryKey: ['patients-metrics'],
    queryFn: async () => {
      const [active, archived, newPatients] = await Promise.all([
        getPatients({ pageIndex: 0, perPage: 1, status: 'ACTIVE' }),
        getPatients({ pageIndex: 0, perPage: 1, status: 'BLOCKED' }),
        getAmountPatientsCard(),
      ])
      return {
        activeCount: active.meta.totalCount,
        archivedCount: archived.meta.totalCount,
        newPatientsCount: newPatients.amount,
      }
    },
    refetchOnWindowFocus: false,
  })

  return {
    activeCount: data?.activeCount ?? 0,
    archivedCount: data?.archivedCount ?? 0,
    newPatientsCount: data?.newPatientsCount ?? 0,
    isLoading,
  }
}
