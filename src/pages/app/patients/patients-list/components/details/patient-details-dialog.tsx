'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { getPatientProfileDetails } from '@/api/patient-profiles/get-patient-profile-details'
import type { ISessionItem } from '@/types/patient/session-item'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { EvolutionViewer } from './evolution-viewer'
import { PatientRegistrationTable } from './patient-registration-table'
import { AverageDurationItem } from './average-duration-item'
import { SessionHistoryTable } from './session-history-table'
import './patient-details-dialog.css'
import { useAuth } from '@/hooks/use-auth'

interface PatientDetailsDialogProps {
  patientId: string
}

export function PatientDetailsDialog({ patientId }: PatientDetailsDialogProps) {
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedSession, setSelectedSession] = useState<ISessionItem | null>(
    null,
  )

  const { profile } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['patient-details', patientId, pageIndex],
    queryFn: () => getPatientProfileDetails(patientId, pageIndex),
    enabled: !!patientId,
  })

  if (isLoading || !data) {
    return (
      <DialogContent className="pdd-loading">
        <DialogTitle className="sr-only">Carregando</DialogTitle>
        <Loader2 className="size-8 animate-spin text-primary" />
      </DialogContent>
    )
  }

  const { patient, meta } = data

  const patientFullName =
    `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim() ||
    'Paciente sem nome'

  return (
    <DialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      className="pdd-content"
    >
      <DialogHeader className={selectedSession ? 'sr-only' : ''}>
        <DialogTitle className="flex items-center gap-2">
          {patientFullName}
        </DialogTitle>
        <DialogDescription>
          Informações cadastrais e histórico clínico
        </DialogDescription>
      </DialogHeader>

      {selectedSession ? (
        <EvolutionViewer
          patientName={patientFullName}
          content={selectedSession.content || 'Nenhuma nota registrada.'}
          date={
            selectedSession.sessionDate ||
            selectedSession.date ||
            selectedSession.createdAt
          }
          diagnosis={selectedSession.theme || 'Sem tema'}
          psychologist={{
            name: profile
              ? `${profile.firstName} ${profile.lastName}`
              : 'Psicólogo Responsável',
            crp: profile?.psychologistProfile?.crp || 'Não informado',
          }}
          onBack={() => setSelectedSession(null)}
        />
      ) : (
        <div className="pdd-body">
          <PatientRegistrationTable
            fullName={patientFullName}
            cpf={patient?.cpf}
            email={patient?.email}
            phoneNumber={patient?.phoneNumber}
          />

          <AverageDurationItem averageDuration={meta.averageDuration} />

          <SessionHistoryTable
            sessions={patient?.sessions ?? []}
            pagination={{
              pageIndex: meta.pageIndex,
              perPage: meta.perPage,
              totalCount: meta.totalCount,
              onPageChange: setPageIndex,
            }}
            onSelectSession={setSelectedSession}
          />
        </div>
      )}
    </DialogContent>
  )
}
