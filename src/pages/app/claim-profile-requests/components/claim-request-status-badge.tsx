import { fn } from '@/utils/fn'
import { Badge } from '@/components/ui/badge'
import { ClaimRequestStatus } from '@/types/enums'
import { translatedClaimRequestStatus } from '@/constants/translated-claim-request-status'
import { CircleCheck, CircleX, Clock } from 'lucide-react'

type IclaimRequestStatusBadge = {
  status: ClaimRequestStatus | null
}

export function ClaimRequestStatusBadge({ status }: IclaimRequestStatusBadge) {
  const STATUS_CONFIG = fn.one(
    status,
    {
      [ClaimRequestStatus.APPROVED]: {
        label: translatedClaimRequestStatus.APPROVED,
        icon: <CircleCheck />,
        style: 'bg-green-100 text-green-500 border-green-500',
      },
      [ClaimRequestStatus.PENDING]: {
        label: translatedClaimRequestStatus.PENDING,
        icon: <Clock />,
        style: 'bg-yellow-100 text-yellow-500 border-yellow-500',
      },
      [ClaimRequestStatus.REJECTED]: {
        label: translatedClaimRequestStatus.REJECTED,
        icon: <CircleX />,
        style: 'bg-red-100 text-red-500 border-red-500',
      },
    },
    {
      label: translatedClaimRequestStatus.PENDING,
      icon: <Clock />,
      style: 'bg-yellow-100 text-yellow-500 border-yellow-500',
    },
  )

  return (
    <Badge variant="outline" className={STATUS_CONFIG.style}>
      {STATUS_CONFIG.icon}
      {STATUS_CONFIG.label}
    </Badge>
  )
}
