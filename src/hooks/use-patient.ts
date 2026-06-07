import { useQuery } from '@tanstack/react-query'
import type { Ipatient } from '@/types/patient'
import { getPatientById } from '@/api/patients/get-patient-by-id'

type IusePatient = {
  patient: Ipatient | null
}

export const usePatient = (patientId: string | undefined): IusePatient => {
  if (!patientId) {
    return { patient: null }
  }

  const { data } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatientById(patientId),
    enabled: Boolean(patientId),
  })

  return {
    patient: data?.patient ?? null,
  }
}
