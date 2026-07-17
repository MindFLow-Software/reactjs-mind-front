'use client'

import { useMemo } from 'react'
import { Copy, Mail, Phone } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Time } from '@/utils/time'
import { Mask } from '@/utils/mask'
import { Clipboard } from '@/utils/clipboard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { UserAvatar } from '@/components/user-avatar/user-avatar'
import { StatusBadge } from '@/components/ui/status-badge'
import { AccountStatus } from '@/types/auth/account-status'
import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import { GENDER_CONFIG } from '@/constants/gender-config'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

import { FollowUpActions } from '../follow-up-actions/follow-up-actions'
import './follow-up-sidebar.css'

const DASH = '—'

type IPatientFollowUpSidebar = {
  patient: Pick<
    IPatientProfile,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'status'
    | 'profileImageUrl'
    | 'gender'
    | 'dateOfBirth'
    | 'cpf'
    | 'phoneNumber'
    | 'email'
  >
}

export function PatientFollowUpSidebar({ patient }: IPatientFollowUpSidebar) {
  const fullName = `${patient.firstName} ${patient.lastName}`
  const isPatientActive = patient.status === PatientProfileStatus.ACTIVE

  const shortId = useMemo(
    () => patient.id.substring(0, 10).toUpperCase(),
    [patient.id],
  )

  const age = Time.calculateAge(patient.dateOfBirth)
  const genderLabel = GENDER_CONFIG[patient.gender].label
  const phone = Mask.phone(patient.phoneNumber)

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="pfu-sidebar">
        <div className="pfu-sidebar-banner" />

        <div className="pfu-sidebar-body">
          <div className="pfu-sidebar-identity">
            <UserAvatar
              identity={{ src: patient.profileImageUrl, name: fullName }}
              className="pfu-sidebar-avatar"
            />

            <StatusBadge
              status={
                isPatientActive ? AccountStatus.ACTIVE : AccountStatus.BLOCKED
              }
              size="md"
              className="pfu-sidebar-status"
            />

            <h2 className="pfu-sidebar-name">{fullName}</h2>

            <div className="pfu-sidebar-meta">
              <span>{age ?? DASH}</span>
              <span className="pfu-sidebar-meta-dot" />
              <span>{genderLabel}</span>
              <span className="pfu-sidebar-meta-dot" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => Clipboard.copy(patient.id)}
                    className="group pfu-sidebar-id"
                  >
                    {shortId}
                    <Copy className="pfu-sidebar-id-icon" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Copiar ID completo
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="pfu-sidebar-contacts">
            <SidebarContact icon={<Phone className="size-4" />} value={phone} />
            <SidebarContact
              icon={<Mail className="size-4" />}
              value={patient.email}
            />
          </div>

          <div className="pfu-sidebar-actions">
            <FollowUpActions />
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}

type ISidebarContact = {
  icon: React.ReactNode
  value: string | null | undefined
}

function SidebarContact({ icon, value }: ISidebarContact) {
  return (
    <div className="pfu-sidebar-contact">
      <span className="pfu-sidebar-contact-icon">{icon}</span>
      <span
        className={cn(
          'pfu-sidebar-contact-value',
          !value && 'text-muted-foreground',
        )}
      >
        {value || DASH}
      </span>
    </div>
  )
}
