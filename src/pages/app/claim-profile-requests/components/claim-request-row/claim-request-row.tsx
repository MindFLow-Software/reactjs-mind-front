import { Calendar, ClipboardCheck } from 'lucide-react'

import { Time } from '@/utils/time'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar/user-avatar'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { IPatientProfileClaimRequest } from '@/types/claim/patient-profile-claim-request'

import { ClaimRequestStatusBadge } from '../claim-request-status-badge/claim-request-status-badge'

import './claim-request-row.css'

interface ClaimRequestRowProps {
  request: IPatientProfileClaimRequest
  psychologistLabel: string
  onReview: (claimRequestId: string) => void
}

export function ClaimRequestRow({
  request,
  psychologistLabel,
  onReview,
}: ClaimRequestRowProps) {
  return (
    <TableRow className="cpr-row">
      <TableCell>
        <div className="flex items-center gap-2">
          <UserAvatar
            identity={{
              src: '',
              name: request.requesterFirstName,
              colorSeed: request.id,
            }}
            size="md"
          />
          <div className="flex flex-col">
            <span className="font-medium">{request.requesterFirstName}</span>
            <span className="text-xs text-muted-foreground">
              {request.requesterEmail}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{request.requesterFirstName}</span>
          <span className="text-xs text-muted-foreground">
            {psychologistLabel}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{request.requestedCpf}</span>
          <span className="text-xs text-muted-foreground">
            {request.requesterDateOfBirth ?? '--/--/----'}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 font-medium">
          <Calendar size={14} />
          <span>
            {request.createdAt &&
              Time.toBrazilianFormat(new Date(request.createdAt))}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <ClaimRequestStatusBadge status={request.status} />
      </TableCell>
      <TableCell className="pr-6 text-right">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => onReview(request.id)}
            >
              <ClipboardCheck size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Revisar</TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
