import '../../patients-columns.css'
import './patient-contact-cell.css'
import { Mail, Phone } from 'lucide-react'
import { TableCell } from '@/components/ui/table'
import { Mask } from '@/utils/mask'

type IPatientContactCell = {
  email: string | null | undefined
  phoneNumber: string | null | undefined
}

export function PatientContactCell({
  email,
  phoneNumber,
}: IPatientContactCell) {
  return (
    <TableCell className="ptc-contact">
      <div className="ptr-contact">
        <div className="ptr-contact-line">
          <Phone className="ptr-contact-icon" aria-hidden="true" />
          <span className="ptr-contact-text">
            {phoneNumber ? Mask.phone(phoneNumber) : '—'}
          </span>
        </div>
        <div className="ptr-contact-line">
          <Mail className="ptr-contact-icon" aria-hidden="true" />
          <span className="ptr-contact-text">{email || '—'}</span>
        </div>
      </div>
    </TableCell>
  )
}
