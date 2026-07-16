import './patient-registration-table.css'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { PatientInfoField } from '../patient-info-field/patient-info-field'
import type { IPatientRegistrationData } from '../../../patients-list.types'

type IPatientRegistrationTable = {
  patient: IPatientRegistrationData
}

type IRegistrationRow = {
  label: string
  field: keyof IPatientRegistrationData
  mask?: string
  valueClassName?: string
}

const REGISTRATION_ROWS: readonly IRegistrationRow[] = [
  { label: 'Nome completo', field: 'fullName' },
  { label: 'CPF', field: 'cpf', mask: '000.000.000-00' },
  { label: 'E-mail', field: 'email', valueClassName: 'lowercase' },
  { label: 'Telefone', field: 'phoneNumber', mask: '(00) 00000-0000' },
]

export function PatientRegistrationTable({
  patient,
}: IPatientRegistrationTable) {
  return (
    <div className="pdd-reg-table">
      <Table>
        <TableBody>
          {REGISTRATION_ROWS.map((row, index) => {
            const isLast = index === REGISTRATION_ROWS.length - 1

            return (
              <TableRow key={row.field}>
                <TableCell
                  className={cn('pdd-reg-label', isLast && 'border-none')}
                >
                  {row.label}
                </TableCell>
                <TableCell
                  className={cn(
                    'pdd-reg-value',
                    row.valueClassName,
                    isLast && 'border-none',
                  )}
                >
                  <PatientInfoField
                    value={patient[row.field]}
                    mask={row.mask}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
