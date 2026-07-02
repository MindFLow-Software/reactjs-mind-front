import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  getPatientProfileDetails,
  type IgetPatientProfileDetailsResponse,
} from '@/api/patient-profiles/get-patient-profile-details'
import { useHeaderStore } from '@/hooks/use-header-store'
import { PATIENT_QUEUE_SOURCE_KEY } from '../constants'

interface UsePatientDetailsReturn {
  patient: IgetPatientProfileDetailsResponse['patient'] | null
  meta: IgetPatientProfileDetailsResponse['meta'] | null
  isLoading: boolean
  isError: boolean
  pageIndex: number
  setPageIndex: Dispatch<SetStateAction<number>>
}

export function usePatientDetails(patientId: string): UsePatientDetailsReturn {
  const [pageIndex, setPageIndex] = useState(0)
  const location = useLocation()
  const { setTitle, setSubtitle } = useHeaderStore()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['patient-hub', patientId, 'details', pageIndex],
    queryFn: () => getPatientProfileDetails(patientId, pageIndex),
    enabled: Boolean(patientId),
    staleTime: 1000 * 60 * 5,
  })

  const patient = data?.patient ?? null
  const meta = data?.meta ?? null

  const patientFullName = useMemo(
    () => (patient ? `${patient.firstName} ${patient.lastName}` : ''),
    [patient],
  )

  const cameFromRecords = useMemo(() => {
    const fromState = (location.state as { from?: string } | null)?.from
    if (fromState === 'patients-records') return true
    if (fromState === 'patients-list') return false
    return (
      sessionStorage.getItem(PATIENT_QUEUE_SOURCE_KEY) === 'patients-records'
    )
  }, [location.state])

  useEffect(() => {
    if (cameFromRecords) {
      setTitle('Prontuarios de Pacientes', '/patients-records')
    } else {
      setTitle('Cadastro de Pacientes', '/patients-list')
    }
    if (patientFullName) setSubtitle(patientFullName)
    return () => setSubtitle(undefined)
  }, [cameFromRecords, patientFullName, setTitle, setSubtitle])

  return { patient, meta, isLoading, isError, pageIndex, setPageIndex }
}
