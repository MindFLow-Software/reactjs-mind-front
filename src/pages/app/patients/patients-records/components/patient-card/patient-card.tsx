import { Clock, ChevronRight } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { UserAvatar } from '@/components/user-avatar/user-avatar'
import { Time } from '@/utils/time'
import type { IPatient } from '@/types/patient/patient'
import './patient-card.css'

type IPatientCard = {
  patient: IPatient
  onOpen: (id: string) => void
}

export function PatientCard({ patient, onOpen }: IPatientCard) {
  return (
    <Card className="group pr-card" onClick={() => onOpen(patient.id)}>
      <CardContent className="pr-card-body">
        <div className="pr-card-main">
          <UserAvatar
            identity={{
              src: patient.profileImageUrl,
              name: `${patient.firstName} ${patient.lastName}`,
            }}
            size="lg"
            className="border-blue-100 shadow-sm"
          />

          <div className="pr-card-info">
            <span className="pr-card-name">
              {`${patient.firstName} ${patient.lastName}`}
            </span>
            <div className="pr-card-meta">
              <Clock className="size-3 text-blue-500/70" />
              {patient.lastSessionAt
                ? `Ultima sessao: ${Time.toRelativeFromNow(patient.lastSessionAt)}`
                : 'Sem sessoes registradas'}
            </div>
          </div>
        </div>
        <ChevronRight className="pr-card-chevron" />
      </CardContent>
    </Card>
  )
}
