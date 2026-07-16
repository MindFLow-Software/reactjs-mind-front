import './patient-details-dialog.css'
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
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

import { EvolutionViewer } from '../evolution-viewer/evolution-viewer'
import { PatientRegistrationTable } from '../patient-registration-table/patient-registration-table'
import { AverageDurationItem } from '../average-duration-item/average-duration-item'
import { SessionHistoryTable } from '../session-history-table/session-history-table'

type IPatientDetailsDialog = {
  patientId: string
}

const UNNAMED_PATIENT = 'Paciente sem nome'
const UNKNOWN_PSYCHOLOGIST = 'Psicólogo Responsável'

export function PatientDetailsDialog({ patientId }: IPatientDetailsDialog) {
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

  const fullName =
    `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim()
  const displayName = fullName || UNNAMED_PATIENT

  function renderBody() {
    if (selectedSession) {
      return (
        <EvolutionViewer
          record={{
            patientName: displayName,
            content: selectedSession.content || 'Nenhuma nota registrada.',
            date:
              selectedSession.sessionDate ||
              selectedSession.date ||
              selectedSession.createdAt,
            diagnosis: selectedSession.theme || 'Sem tema',
          }}
          psychologist={{
            name: profile
              ? `${profile.firstName} ${profile.lastName}`
              : UNKNOWN_PSYCHOLOGIST,
            crp: profile?.psychologistProfile?.crp || 'Não informado',
          }}
          onBack={() => setSelectedSession(null)}
        />
      )
    }

    return (
      <div className="pdd-body">
        <PatientRegistrationTable
          patient={{
            fullName,
            cpf: patient?.cpf,
            email: patient?.email,
            phoneNumber: patient?.phoneNumber,
          }}
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
    )
  }

  return (
    <DialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      className="pdd-content"
    >
      <DialogHeader className={cn(selectedSession && 'sr-only')}>
        <DialogTitle className="pdd-title">{displayName}</DialogTitle>
        <DialogDescription>
          Informações cadastrais e histórico clínico
        </DialogDescription>
      </DialogHeader>

      {renderBody()}
    </DialogContent>
  )
}
