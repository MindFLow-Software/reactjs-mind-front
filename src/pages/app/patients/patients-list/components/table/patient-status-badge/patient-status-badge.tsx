import { StatusBadge } from '@/components/badges/status-badge/status-badge'
import type { IStatusBadgeTone } from '@/components/badges/status-badge/status-badge'
import { translatedPatientProfileStatus } from '@/constants/translated-patient-profile-status'
import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import { fn } from '@/utils/fn'

type IPatientStatusBadge = {
  status: PatientProfileStatus
}

const STATUS_TONE: Record<PatientProfileStatus, IStatusBadgeTone> = {
  [PatientProfileStatus.ACTIVE]: 'success',
  [PatientProfileStatus.INACTIVE]: 'muted',
  [PatientProfileStatus.ARCHIVED]: 'destructive',
}

export function PatientStatusBadge({ status }: IPatientStatusBadge) {
  const tone = fn.one(
    status,
    STATUS_TONE,
    STATUS_TONE[PatientProfileStatus.ACTIVE],
  )

  return (
    <StatusBadge tone={tone} label={translatedPatientProfileStatus[status]} />
  )
}
