import { Badge } from '@/components/ui/badge'
import { TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { GENDER_CONFIG } from '@/constants/gender-config'
import { fn } from '@/utils/fn'
import { Gender } from '@/types/shared/enums'
import type { IPatient } from '@/types/patient/patient'

interface PatientGenderCellProps {
  gender: IPatient['gender']
}

export function PatientGenderCell({ gender }: PatientGenderCellProps) {
  const genderCfg = fn.one(gender, GENDER_CONFIG, GENDER_CONFIG[Gender.OTHER])

  return (
    <TableCell className="ptr-cell-gender">
      <Badge className={cn('ptr-gender-badge', genderCfg.className)}>
        <genderCfg.icon className="ptr-gender-icon" aria-hidden="true" />
        {genderCfg.label}
      </Badge>
    </TableCell>
  )
}
