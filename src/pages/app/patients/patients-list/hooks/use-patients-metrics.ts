import { useQuery } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import { fetchPatientProfiles } from '@/api/patient-profiles/fetch-patient-profiles'
import { getActivePatientProfilesAmount } from '@/api/patient-profiles/get-active-patient-profiles-amount'
import { getNewPatientProfilesAmount } from '@/api/patient-profiles/get-new-patient-profiles-amount'
import type { PatientsMetrics } from '../patients-list.types'

const NEW_PATIENTS_WINDOW_DAYS = 30

export function usePatientsMetrics(): PatientsMetrics {
  const { data, isLoading } = useQuery({
    queryKey: ['patients-metrics'],
    queryFn: async () => {
      const endDate = new Date()
      const startDate = subDays(endDate, NEW_PATIENTS_WINDOW_DAYS)

      const [totalPatients, active, newPatientsByDay] = await Promise.all([
        fetchPatientProfiles({ pageIndex: 0, perPage: 1 }),
        getActivePatientProfilesAmount(),
        getNewPatientProfilesAmount({ startDate, endDate }),
      ])

      return {
        activeCount: active.amount,
        archivedCount: Math.max(
          totalPatients.meta.totalCount - active.amount,
          0,
        ),
        newPatientsCount: newPatientsByDay.reduce(
          (sum, day) => sum + day.newPatients,
          0,
        ),
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
