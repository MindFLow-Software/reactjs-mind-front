import './patient-status-badge.css'
import { Badge } from '@/components/ui/badge'
import { translatedPatientProfileStatus } from '@/constants/translated-patient-profile-status'
import { cn } from '@/lib/utils'
import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import { fn } from '@/utils/fn'

type IPatientStatusBadge = {
  status: PatientProfileStatus
}

type IStatusBadgeStyle = {
  label: string
  style: string
}

const STATUS_BADGE: Record<PatientProfileStatus, IStatusBadgeStyle> = {
  [PatientProfileStatus.ACTIVE]: {
    label: translatedPatientProfileStatus.ACTIVE,
    style: 'psb-badge--active',
  },
  [PatientProfileStatus.INACTIVE]: {
    label: translatedPatientProfileStatus.INACTIVE,
    style: 'psb-badge--inactive',
  },
  [PatientProfileStatus.ARCHIVED]: {
    label: translatedPatientProfileStatus.ARCHIVED,
    style: 'psb-badge--archived',
  },
}

export function PatientStatusBadge({ status }: IPatientStatusBadge) {
  const badge = fn.one(
    status,
    STATUS_BADGE,
    STATUS_BADGE[PatientProfileStatus.ACTIVE],
  )

  return <Badge className={cn('psb-badge', badge.style)}>{badge.label}</Badge>
}
