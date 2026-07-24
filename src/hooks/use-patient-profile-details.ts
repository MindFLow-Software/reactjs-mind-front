import { getPatientProfileDetails } from '@/api/patient-profiles/get-patient-profile-details'
import { useQuery } from '@tanstack/react-query'

export function usePatientProfileDetails(
  patientProfileId: string | undefined,
  pageIndex: number,
) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['patient-details', patientProfileId, pageIndex],
    queryFn: () => getPatientProfileDetails(patientProfileId, pageIndex),
    enabled: Boolean(patientProfileId),
  })

  return {
    isError,
    refetch,
    meta: data?.meta,
    patientProfileDetails: data?.patient,
    isPatientProfileDetailsLoading: isLoading,
  }
}
