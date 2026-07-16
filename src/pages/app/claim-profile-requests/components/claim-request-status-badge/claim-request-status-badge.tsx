import { CircleCheck, CircleX, Clock } from 'lucide-react'

import { fn } from '@/utils/fn'
import { Badge } from '@/components/ui/badge'
import { ClaimRequestStatus } from '@/types/claim/claim-request-status'
import { translatedClaimRequestStatus } from '@/constants/translated-claim-request-status'

import './claim-request-status-badge.css'

type ClaimRequestStatusBadgeProps = {
  status: ClaimRequestStatus | null
}

const PENDING_CONFIG = {
  label: translatedClaimRequestStatus.PENDING,
  icon: <Clock />,
  className: 'cpr-status-pending',
}

export function ClaimRequestStatusBadge({
  status,
}: ClaimRequestStatusBadgeProps) {
  const config = fn.one(
    status,
    {
      [ClaimRequestStatus.APPROVED]: {
        label: translatedClaimRequestStatus.APPROVED,
        icon: <CircleCheck />,
        className: 'cpr-status-approved',
      },
      [ClaimRequestStatus.PENDING]: PENDING_CONFIG,
      [ClaimRequestStatus.REJECTED]: {
        label: translatedClaimRequestStatus.REJECTED,
        icon: <CircleX />,
        className: 'cpr-status-rejected',
      },
    },
    PENDING_CONFIG,
  )

  return (
    <Badge variant="outline" className={config.className}>
      {config.icon}
      {config.label}
    </Badge>
  )
}
