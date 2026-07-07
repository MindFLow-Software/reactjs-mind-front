import { Mail, Phone } from 'lucide-react'
import { TableCell } from '@/components/ui/table'
import { formatPhone } from '@/utils/formatPhone'

interface PatientContactCellProps {
  email: string | null | undefined
  phoneNumber: string | null | undefined
}

export function PatientContactCell({
  email,
  phoneNumber,
}: PatientContactCellProps) {
  return (
    <TableCell className="ptr-cell-contact">
      <div className="ptr-contact">
        <div className="ptr-contact-line">
          <Phone className="ptr-contact-icon" aria-hidden="true" />
          <span className="ptr-contact-text">
            {phoneNumber ? formatPhone(phoneNumber) : '—'}
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
