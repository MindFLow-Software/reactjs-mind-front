'use client'

import { useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ClipboardList } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import {
  fetchPatientProfiles,
  type IgetPatientsQueryParams,
} from '@/api/patient-profiles/fetch-patient-profiles'
import { useHeaderStore } from '@/store/use-header-store'
import { usePatientQueueStore } from '@/store/use-patient-queue-store'
import { PatientsDataBlock } from '../components/patients-data-block/patients-data-block'
import { PatientsPageShell } from '../components/patients-page-shell/patients-page-shell'
import { usePatientRecordsFilters } from '@/hooks/use-patient-records-filters'
import { PatientCard } from './components/patient-card/patient-card'
import { RecordsSkeleton } from './components/records-skeleton/records-skeleton'
import { RecordsEmptyState } from './components/records-empty-state/records-empty-state'
import { PatientsRecordsTableFilters } from './components/patients-records-table-filters/patients-records-table-filters'
import './patients-records.css'

export default function PatientsRecords() {
  const navigate = useNavigate()
  const { setTitle } = useHeaderStore()
  const setQueue = usePatientQueueStore((state) => state.setQueue)

  const {
    search,
    debouncedSearch,
    gender,
    sessionOrder,
    setSearch,
    setGender,
    setSessionOrder,
    clearFilters,
  } = usePatientRecordsFilters()

  const { data: result, isLoading } = useQuery({
    queryKey: [
      'patients-records-list',
      debouncedSearch,
      gender /*, sessionOrder */,
    ],
    queryFn: () =>
      fetchPatientProfiles({
        pageIndex: 0,
        perPage: 100,
        filter: debouncedSearch || undefined,
        gender:
          gender === 'all'
            ? undefined
            : (gender as IgetPatientsQueryParams['gender']),
        // sessionVolume: sessionOrder,
      }),
    placeholderData: (previousData) => previousData,
  })

  useEffect(() => {
    setTitle('Prontuarios de Pacientes')
  }, [setTitle])

  const patients = useMemo(() => result?.patients ?? [], [result])

  const handleOpenRecord = (patientId: string) => {
    setQueue(
      patients.map((p) => p.id),
      'patients-records',
    )
    navigate(`/patient/${patientId}/follow-up`, {
      state: { from: 'patients-records' },
    })
  }

  function renderRecords() {
    if (isLoading) return <RecordsSkeleton />
    if (patients.length === 0) return <RecordsEmptyState />

    return patients.map((patient) => (
      <PatientCard
        key={patient.id}
        patient={patient}
        onOpen={handleOpenRecord}
      />
    ))
  }

  return (
    <>
      <Helmet title="Prontuarios de Pacientes" />

      <PatientsPageShell>
        <PatientsPageShell.Header
          title="Prontuarios Eletronicos"
          description="Busque e acesse rapidamente o historico clinico de seus pacientes."
          icon={<ClipboardList className="size-6 text-blue-600" />}
        />
        <PatientsPageShell.Content className="p-4">
          <PatientsDataBlock>
            <PatientsDataBlock.Header
              title="Pacientes com prontuario"
              description="Filtre por status, genero, cadastro e volume de sessoes."
            />
            <PatientsDataBlock.Toolbar>
              <PatientsRecordsTableFilters
                filters={{
                  search: { value: search, onChange: setSearch },
                  gender: { value: gender, onChange: setGender },
                  sessionOrder: {
                    value: sessionOrder,
                    onChange: setSessionOrder,
                  },
                }}
                onClearFilters={clearFilters}
              />
            </PatientsDataBlock.Toolbar>
            <PatientsDataBlock.Content>
              <div className="pr-grid">{renderRecords()}</div>
            </PatientsDataBlock.Content>
          </PatientsDataBlock>
        </PatientsPageShell.Content>
      </PatientsPageShell>
    </>
  )
}
