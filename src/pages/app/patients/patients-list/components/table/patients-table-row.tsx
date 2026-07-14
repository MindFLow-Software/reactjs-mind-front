import { memo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { IPatient } from '@/types/patient/patient'

import { PatientStatusBadge } from './patient-status-badge'
import { PatientIdentityCell } from './row/patient-identity-cell'
import { PatientContactCell } from './row/patient-contact-cell'
import { PatientLastSessionCell } from './row/patient-last-session-cell'
import { PatientAgeCell } from './row/patient-age-cell'
import { PatientGenderCell } from './row/patient-gender-cell'
import { PatientsRowActions } from './row/patients-row-actions'
import './patients-table-row.css'

interface PatientsTableRowProps {
  patient: IPatient
}

export const PatientsTableRow = memo(function PatientsTableRow({
  patient,
}: PatientsTableRowProps) {
  const fullName = `${patient.firstName} ${patient.lastName}`

  return (
    <TooltipProvider delayDuration={200}>
      <TableRow className="group ptr-row">
        <TableCell className="ptr-cell-checkbox">
          <Checkbox
            className="cursor-pointer"
            aria-label={`Selecionar ${fullName}`}
          />
        </TableCell>

        <PatientIdentityCell patient={patient} />

        <TableCell className="ptr-cell-status">
          <PatientStatusBadge status={patient.status} />
        </TableCell>

        <PatientContactCell
          email={patient.email}
          phoneNumber={patient.phoneNumber}
        />

        <PatientLastSessionCell lastSessionAt={patient.lastSessionAt} />

        <PatientAgeCell dateOfBirth={patient.dateOfBirth} />

        <PatientGenderCell gender={patient.gender} />

        <PatientsRowActions patient={patient} />
      </TableRow>
    </TooltipProvider>
  )
})
