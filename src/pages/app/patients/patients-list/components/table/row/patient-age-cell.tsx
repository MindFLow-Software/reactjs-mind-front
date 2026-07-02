import { differenceInYears, format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { TableCell } from '@/components/ui/table'

interface PatientAgeCellProps {
  dateOfBirth: string | null | undefined
}

export function PatientAgeCell({ dateOfBirth }: PatientAgeCellProps) {
  const age = dateOfBirth ? differenceInYears(new Date(), dateOfBirth) : null
  const ageDisplay = age ? `${age} ${age === 1 ? 'ano' : 'anos'}` : '—'

  return (
    <TableCell className="ptr-cell-age">
      <div className="ptr-age">
        <span className="ptr-age-value">{ageDisplay}</span>
        {dateOfBirth && (
          <span className="ptr-age-dob">
            <CalendarDays className="ptr-age-dob-icon" aria-hidden="true" />
            {format(new Date(dateOfBirth), 'dd/MM/yyyy')}
          </span>
        )}
      </div>
    </TableCell>
  )
}
