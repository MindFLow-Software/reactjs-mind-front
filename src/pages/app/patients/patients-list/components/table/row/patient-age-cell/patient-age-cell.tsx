import '../../patients-columns.css'
import './patient-age-cell.css'
import { CalendarDays } from 'lucide-react'
import { TableCell } from '@/components/ui/table'
import { Time } from '@/utils/time'

type IPatientAgeCell = {
  dateOfBirth: string | null | undefined
}

export function PatientAgeCell({ dateOfBirth }: IPatientAgeCell) {
  const age = Time.calculateAge(dateOfBirth)

  return (
    <TableCell className="ptc-age">
      <div className="ptr-age">
        <span className="ptr-age-value">{age ?? '—'}</span>
        {dateOfBirth && (
          <span className="ptr-age-dob">
            <CalendarDays className="ptr-age-dob-icon" aria-hidden="true" />
            {Time.toBrazilianFormat(dateOfBirth)}
          </span>
        )}
      </div>
    </TableCell>
  )
}
