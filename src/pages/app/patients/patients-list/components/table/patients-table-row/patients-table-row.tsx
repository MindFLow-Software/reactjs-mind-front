import '../patients-columns.css'
import './patients-table-row.css'
import { memo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { IPatient } from '@/types/patient/patient'

import { PatientStatusBadge } from '../patient-status-badge/patient-status-badge'
import { PatientIdentityCell } from '../row/patient-identity-cell/patient-identity-cell'
import { PatientContactCell } from '../row/patient-contact-cell/patient-contact-cell'
import { PatientLastSessionCell } from '../row/patient-last-session-cell/patient-last-session-cell'
import { PatientAgeCell } from '../row/patient-age-cell/patient-age-cell'
import { PatientGenderCell } from '../row/patient-gender-cell/patient-gender-cell'
import { PatientsRowActions } from '../row/patients-row-actions/patients-row-actions'

type IPatientsTableRow = {
  patient: IPatient
}

export const PatientsTableRow = memo(function PatientsTableRow({
  patient,
}: IPatientsTableRow) {
  const fullName = `${patient.firstName} ${patient.lastName}`

  return (
    <TooltipProvider delayDuration={200}>
      <TableRow className="group ptr-row">
        <TableCell className="ptc-checkbox">
          <Checkbox
            className="cursor-pointer"
            aria-label={`Selecionar ${fullName}`}
          />
        </TableCell>

        <PatientIdentityCell patient={patient} />

        <TableCell className="ptc-status">
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
