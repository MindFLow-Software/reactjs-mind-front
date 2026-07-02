import { Badge } from '@/components/ui/badge'
import { translatedPatientProfileStatus } from '@/constants/translated-patient-profile-status'
import { PatientProfileStatus } from '@/types/patient-profile'
import { fn } from '@/utils/fn'

type IpatientStatusBadge = {
  status: PatientProfileStatus
}

export function PatientStatusBadge({ status }: IpatientStatusBadge) {
  const statusMap = fn.one(
    status,
    {
      [PatientProfileStatus.ACTIVE]: {
        label: translatedPatientProfileStatus.ACTIVE,
        style:
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      },
      [PatientProfileStatus.INACTIVE]: {
        label: translatedPatientProfileStatus.INACTIVE,
        style:
          'bg-neutral-200 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400',
      },
      [PatientProfileStatus.ARCHIVED]: {
        label: translatedPatientProfileStatus.ARCHIVED,
        style: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      },
    },
    {
      label: translatedPatientProfileStatus.ACTIVE,
      style:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
  )

  return <Badge className={statusMap.style}>{statusMap.label}</Badge>
}
