import { useQuery } from '@tanstack/react-query'
import { getPatientProfileById } from '@/api/patient-profiles/get-patient-profile-by-id'
import type { IpatientProfile } from '@/types/patient-profile'

type IusePatient = {
  patient: IpatientProfile | null
}

export const usePatient = (patientId: string | undefined): IusePatient => {
  if (!patientId) {
    return { patient: null }
  }

  const { data } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatientProfileById(patientId),
    enabled: Boolean(patientId),
  })

  return {
    patient: data?.patient ?? null,
  }
}
