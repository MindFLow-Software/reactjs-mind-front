import '../../patients-columns.css'
import './patient-identity-cell.css'
import { TableCell } from '@/components/ui/table'
import { UserAvatar } from '@/components/user-avatar/user-avatar'
import { Mask } from '@/utils/mask'
import type { IPatient } from '@/types/patient/patient'

type IPatientIdentityCell = {
  patient: Pick<
    IPatient,
    'id' | 'firstName' | 'lastName' | 'cpf' | 'profileImageUrl'
  >
}

export function PatientIdentityCell({ patient }: IPatientIdentityCell) {
  const fullName = `${patient.firstName} ${patient.lastName}`

  return (
    <TableCell className="ptc-identity">
      <div className="ptr-identity">
        <UserAvatar
          identity={{
            src: patient.profileImageUrl,
            name: fullName,
            colorSeed: patient.id,
          }}
          size="md"
        />
        <div className="ptr-identity-info">
          <span className="ptr-identity-name">{fullName}</span>
          <span className="ptr-identity-cpf">
            {patient.cpf ? Mask.cpf(patient.cpf) : '—'}
          </span>
        </div>
      </div>
    </TableCell>
  )
}
