'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileSearch } from 'lucide-react'

import { getPatientProfileDetails } from '@/api/patient-profiles/get-patient-profile-details'
import { useHeaderStore } from '@/store/use-header-store'
import { usePatientQueueStore } from '@/store/use-patient-queue-store'

import { PatientsDetailsLoading } from './components/loading'
import { PatientsDataBlock } from '../components/patients-data-block/patients-data-block'
import { PatientsPageShell } from '../components/patients-page-shell/patients-page-shell'
import { HubActions } from './components/hub-actions'
import { HubTopBar } from './components/hub-top-bar'
import { PatientHubTabs } from './components/patient-hub-tabs'
import { PatientDetailsError } from './components/patient-details-error'
import { usePatientQueue } from './hooks/use-patient-queue'
import './patients-details.css'

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { setTitle, setSubtitle } = useHeaderStore()
  const queueSource = usePatientQueueStore((state) => state.source)

  const [pageIndex, setPageIndex] = useState(0)

  const {
    data: result,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['patient-details', id, pageIndex],
    queryFn: () => getPatientProfileDetails(id, pageIndex),
    enabled: !!id,
  })

  const patientData = result?.patient
  const meta = result?.meta

  const patientFullName = useMemo(
    () =>
      patientData ? `${patientData.firstName} ${patientData.lastName}` : '',
    [patientData],
  )

  const cameFromRecords = useMemo(() => {
    const fromState = (location.state as { from?: string } | null)?.from
    if (fromState === 'patients-records') return true
    if (fromState === 'patients-list') return false
    return queueSource === 'patients-records'
  }, [location.state, queueSource])

  const { queue, currentIndex, hasPrev, hasNext } = usePatientQueue(id ?? '')

  useEffect(() => {
    if (cameFromRecords) {
      setTitle('Prontuarios de Pacientes', '/patients-records')
    } else {
      setTitle('Cadastro de Pacientes', '/patients-list')
    }

    if (patientFullName) setSubtitle(patientFullName)

    return () => setSubtitle(undefined)
  }, [cameFromRecords, patientFullName, setTitle, setSubtitle])

  if (isError) {
    return <PatientDetailsError onRetry={() => refetch()} />
  }

  if (isLoading || !patientData || !meta) {
    return <PatientsDetailsLoading />
  }

  const prevId = hasPrev ? queue[currentIndex - 1] : null
  const nextId = hasNext ? queue[currentIndex + 1] : null

  return (
    <div className="phd-page">
      <HubTopBar
        queue={{ prevId, nextId, currentIndex, total: queue.length }}
      />

      <PatientsPageShell>
        <PatientsPageShell.Header
          title="Prontuário completo do Paciente"
          description="Acompanhamento clinico, historico de sessoes e documentos em um unico lugar."
          icon={<FileSearch className="size-5 text-blue-600" />}
        >
          <HubActions />
        </PatientsPageShell.Header>

        <PatientsPageShell.Content className="phd-content">
          <PatientsDataBlock className="phd-data-block">
            <PatientsDataBlock.Header
              title="Prontuario e acompanhamento"
              description="Navegue entre dados cadastrais, anamnese, historico, arquivos e resumo clinico."
            />

            <PatientsDataBlock.Content>
              <PatientHubTabs
                patient={patientData}
                timeline={{ meta, pageIndex, onPageChange: setPageIndex }}
              />
            </PatientsDataBlock.Content>
          </PatientsDataBlock>
        </PatientsPageShell.Content>
      </PatientsPageShell>
    </div>
  )
}
