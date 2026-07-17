'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileSearch } from 'lucide-react'

import { getPatientProfileDetails } from '@/api/patient-profiles/get-patient-profile-details'
import { useHeaderStore } from '@/store/use-header-store'
import { usePatientQueueStore } from '@/store/use-patient-queue-store'

import { PatientsDetailsLoading } from './components/loading/loading'
import { FollowUpActions } from './components/follow-up-actions/follow-up-actions'
import { FollowUpTopBar } from './components/follow-up-top-bar/follow-up-top-bar'
import { PatientFollowUpSidebar } from './components/follow-up-sidebar/follow-up-sidebar'
import { PatientFollowUpTabs } from './components/follow-up-tabs/follow-up-tabs'
import { PatientDetailsError } from './components/patient-details-error/patient-details-error'
import { usePatientQueue } from './hooks/use-patient-queue'
import './patient-follow-up.css'

export default function PatientFollowUp() {
  const { patientId } = useParams<{ patientId: string }>()
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
    queryKey: ['patient-details', patientId, pageIndex],
    queryFn: () => getPatientProfileDetails(patientId, pageIndex),
    enabled: !!patientId,
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

  const { queue, currentIndex, hasPrev, hasNext } = usePatientQueue(
    patientId ?? '',
  )

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
    <div className="pfu-page">
      <FollowUpTopBar
        queue={{ prevId, nextId, currentIndex, total: queue.length }}
      />

      <header className="pfu-page-header">
        <div className="pfu-page-heading">
          <span className="pfu-page-icon">
            <FileSearch className="size-5 text-blue-600" />
          </span>
          <div className="pfu-page-heading-text">
            <h1 className="pfu-page-title">Acompanhamento do Paciente</h1>
            <p className="pfu-page-description">
              Acompanhamento clinico, historico de sessoes e documentos em um
              unico lugar.
            </p>
          </div>
        </div>

        <FollowUpActions />
      </header>

      <div className="pfu-body">
        <PatientFollowUpSidebar patient={patientData} />

        <div className="pfu-content">
          <PatientFollowUpTabs
            patient={patientData}
            timeline={{ meta, pageIndex, onPageChange: setPageIndex }}
          />
        </div>
      </div>
    </div>
  )
}
