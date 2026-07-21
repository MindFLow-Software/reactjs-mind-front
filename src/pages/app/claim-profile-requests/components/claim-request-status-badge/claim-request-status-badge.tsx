import { CircleCheck, CircleX, Clock, type LucideIcon } from 'lucide-react'

import { StatusBadge } from '@/components/badges/status-badge/status-badge'
import type { IStatusBadgeTone } from '@/components/badges/status-badge/status-badge'
import { fn } from '@/utils/fn'
import { ClaimRequestStatus } from '@/types/claim/claim-request-status'
import { translatedClaimRequestStatus } from '@/constants/translated-claim-request-status'

type ClaimRequestStatusBadgeProps = {
  status: ClaimRequestStatus | null
}

type IConfig = {
  label: string
  icon: LucideIcon
  tone: IStatusBadgeTone
}

const PENDING_CONFIG: IConfig = {
  label: translatedClaimRequestStatus.PENDING,
  icon: Clock,
  tone: 'warning',
}

const CONFIG: Record<ClaimRequestStatus, IConfig> = {
  [ClaimRequestStatus.APPROVED]: {
    label: translatedClaimRequestStatus.APPROVED,
    icon: CircleCheck,
    tone: 'success',
  },
  [ClaimRequestStatus.PENDING]: PENDING_CONFIG,
  [ClaimRequestStatus.REJECTED]: {
    label: translatedClaimRequestStatus.REJECTED,
    icon: CircleX,
    tone: 'destructive',
  },
}

export function ClaimRequestStatusBadge({
  status,
}: ClaimRequestStatusBadgeProps) {
  const config = fn.one(status, CONFIG, PENDING_CONFIG)

  return (
    <StatusBadge tone={config.tone} icon={config.icon} label={config.label} />
  )
}
