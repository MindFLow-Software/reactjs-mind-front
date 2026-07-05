import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { PatientInfoField } from './patient-info-field'

interface PatientRegistrationTableProps {
  fullName: string
  cpf?: string | null
  email?: string | null
  phoneNumber?: string | null
}

export function PatientRegistrationTable({
  fullName,
  cpf,
  email,
  phoneNumber,
}: PatientRegistrationTableProps) {
  return (
    <div className="pdd-reg-table">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="pdd-reg-label">Nome completo</TableCell>
            <TableCell className="pdd-reg-value">
              <PatientInfoField
                value={fullName === 'Paciente sem nome' ? null : fullName}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="pdd-reg-label">CPF</TableCell>
            <TableCell className="pdd-reg-value">
              <PatientInfoField value={cpf} mask="000.000.000-00" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="pdd-reg-label">E-mail</TableCell>
            <TableCell className="pdd-reg-value lowercase">
              <PatientInfoField value={email} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="pdd-reg-label border-none">
              Telefone
            </TableCell>
            <TableCell className="pdd-reg-value border-none">
              <PatientInfoField value={phoneNumber} mask="(00) 00000-0000" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
