import { TableCell } from '@/components/ui/table'
import { UserAvatar } from '@/components/user-avatar'
import { formatCPF } from '@/utils/formatCPF'
import type { IPatient } from '@/types/patient/patient'

interface PatientIdentityCellProps {
  patient: Pick<
    IPatient,
    'id' | 'firstName' | 'lastName' | 'cpf' | 'profileImageUrl'
  >
}

export function PatientIdentityCell({ patient }: PatientIdentityCellProps) {
  const fullName = `${patient.firstName} ${patient.lastName}`

  return (
    <TableCell className="ptr-cell-identity">
      <div className="ptr-identity">
        <UserAvatar
          src={patient.profileImageUrl}
          name={fullName}
          size="md"
          colorSeed={patient.id}
        />
        <div className="ptr-identity-info">
          <span className="ptr-identity-name">{fullName}</span>
          <span className="ptr-identity-cpf">
            {patient.cpf ? formatCPF(patient.cpf) : '—'}
          </span>
        </div>
      </div>
    </TableCell>
  )
}
