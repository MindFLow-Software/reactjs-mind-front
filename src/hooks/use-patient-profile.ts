import { useQuery } from '@tanstack/react-query'
import { getPatientProfileById } from '@/api/patient-profiles/get-patient-profile-by-id'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

type IusePatientProfile = {
  patient: IPatientProfile | null
}

export const usePatientProfile = (
  patientProfileId: string | undefined,
): IusePatientProfile => {
  if (!patientProfileId) {
    return { patient: null }
  }

  const { data } = useQuery({
    queryKey: ['patient-profile', patientProfileId],
    queryFn: () => getPatientProfileById(patientProfileId),
    enabled: Boolean(patientProfileId),
  })

  return {
    patient: data?.patient ?? null,
  }
}
