'use client'

import { cn } from '@/lib/utils'
import { Copy } from 'lucide-react'
import { useMemo } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { StatusBadge } from '@/components/ui/status-badge'

import './patient-details-header.css'
import { copyToClipboard } from '@/utils/copy-to-clipboard'
import { PatientProfileStatus } from '@/types/enums'
import { AccountStatus } from '@/types/auth/account-status'
import type { IPatientProfile } from '@/types/patient-profile'

interface PatientDetailsHeaderProps {
  patient: Pick<
    IPatientProfile,
    'id' | 'firstName' | 'lastName' | 'status' | 'profileImageUrl'
  >
}

export function PatientDetailsHeader({ patient }: PatientDetailsHeaderProps) {
  const shortId = useMemo(
    () => patient.id.substring(0, 10).toUpperCase(),
    [patient.id],
  )

  const fullName = `${patient.firstName} ${patient.lastName}`
  const isPatientActive = patient.status === PatientProfileStatus.ACTIVE

  return (
    <TooltipProvider delayDuration={200}>
      <header className="ph-patient-details-header">
        <div className="ph-patient-details-header__row">
          <div className="ph-patient-details-header__avatar-wrap">
            <UserAvatar
              src={patient.profileImageUrl}
              name={fullName}
              className="ph-patient-details-header__avatar"
            />

            <span
              className={cn(
                'ph-patient-details-header__status-dot',
                isPatientActive
                  ? 'ph-patient-details-header__status-dot--active'
                  : 'ph-patient-details-header__status-dot--inactive',
              )}
            >
              {isPatientActive && (
                <span className="ph-patient-details-header__status-pulse" />
              )}
            </span>
          </div>

          <div className="ph-patient-details-header__info">
            <div className="ph-patient-details-header__name-row">
              <h1 className="ph-patient-details-header__name">{fullName}</h1>

              <StatusBadge
                status={
                  isPatientActive ? AccountStatus.ACTIVE : AccountStatus.BLOCKED
                }
                size="md"
              />
            </div>

            <div className="group ph-patient-details-header__id-row">
              <Copy className="ph-patient-details-header__id-icon" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => copyToClipboard(shortId)}
                    className="ph-patient-details-header__id-btn"
                  >
                    ID: {shortId}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Copiar ID completo
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
