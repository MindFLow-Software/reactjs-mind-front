import { useQuery } from '@tanstack/react-query'
import { getPatients } from '@/api/patients/get-patients'
import { getAmountPatientsCard } from '@/api/patients/get-amount-patients-card'
import { getDashboardMetrics } from '@/api/patients/get-dashboard-metrics'
import type { PatientsMetrics } from '../patients-list.types'

export function usePatientsMetrics(): PatientsMetrics {
  const { data, isLoading } = useQuery({
    queryKey: ['patients-metrics'],
    queryFn: async () => {
      const [dashboard, archived, newPatients] = await Promise.all([
        getDashboardMetrics(),
        getPatients({ pageIndex: 0, perPage: 1, isActive: false }),
        getAmountPatientsCard(),
      ])
      return {
        activeCount: dashboard.activePatients,
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
