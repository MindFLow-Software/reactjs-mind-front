import { Badge } from '@/components/ui/badge'
import { TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { GENDER_CONFIG } from '@/utils/gender-config'
import type { IPatient } from '@/types/patient'

interface PatientGenderCellProps {
  gender: IPatient['gender']
}

export function PatientGenderCell({ gender }: PatientGenderCellProps) {
  const genderCfg =
    GENDER_CONFIG[gender as keyof typeof GENDER_CONFIG] ?? GENDER_CONFIG.OTHER

  return (
    <TableCell className="ptr-cell-gender">
      <Badge className={cn('ptr-gender-badge', genderCfg.className)}>
        <genderCfg.icon className="ptr-gender-icon" aria-hidden="true" />
        {genderCfg.label}
      </Badge>
    </TableCell>
  )
}
