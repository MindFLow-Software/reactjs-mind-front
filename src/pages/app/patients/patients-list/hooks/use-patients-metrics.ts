import { useQuery } from '@tanstack/react-query'
import { fetchPatientProfiles } from '@/api/patient-profiles/fetch-patient-profiles'
import { getActivePatientProfilesAmount } from '@/api/patient-profiles/get-active-patient-profiles-amount'
import { getDashboardMetrics } from '@/api/patient-profiles/get-dashboard-metrics'
import type { PatientsMetrics } from '../patients-list.types'

export function usePatientsMetrics(): PatientsMetrics {
  const { data, isLoading } = useQuery({
    queryKey: ['patients-metrics'],
    queryFn: async () => {
      const [dashboard, archived, newPatients] = await Promise.all([
        getDashboardMetrics(),
        fetchPatientProfiles({ pageIndex: 0, perPage: 1, isActive: false }),
        getActivePatientProfilesAmount(),
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
