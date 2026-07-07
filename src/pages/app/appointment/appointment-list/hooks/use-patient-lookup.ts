import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchPatientProfiles } from '@/api/patient-profiles/fetch-patient-profiles'
import { queryKeys } from '@/constants/query-keys'

export interface IPatientOption {
  id: string
  name: string
}

export interface UsePatientLookupReturn {
  patients: IPatientOption[]
  isLoading: boolean
}

const PATIENT_LOOKUP_PARAMS = { pageIndex: 0, perPage: 1000 }

export function usePatientLookup(): UsePatientLookupReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.patients(PATIENT_LOOKUP_PARAMS),
    queryFn: () => fetchPatientProfiles(PATIENT_LOOKUP_PARAMS),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (isError) toast.error('Erro ao carregar a lista de pacientes.')
  }, [isError])

  const patients = useMemo<IPatientOption[]>(() => {
    if (!data?.patients) return []
    return data.patients.map((patient) => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
    }))
  }, [data])

  return { patients, isLoading }
}
