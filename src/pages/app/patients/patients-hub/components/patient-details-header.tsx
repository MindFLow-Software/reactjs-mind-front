'use client'

import { Copy } from 'lucide-react'
import { useMemo } from 'react'

import { StatusBadge } from '@/components/ui/status-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import type { PatientStatus } from '@/types/patient'

interface PatientDetailsHeaderProps {
  patient: {
    id: string
    firstName: string
    lastName: string
    status: PatientStatus
    isActive: boolean
    profileImageUrl: string | null
  }
}

export function PatientDetailsHeader({ patient }: PatientDetailsHeaderProps) {
  const shortId = useMemo(
    () => patient.id.substring(0, 10).toUpperCase(),
    [patient.id],
  )
  const fullName = `${patient.firstName} ${patient.lastName}`
  const isPatientActive = patient.isActive

  const handleCopyId = () => {
    navigator.clipboard.writeText(patient.id)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <header className="flex flex-col gap-5 pb-1">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <UserAvatar
              src={patient.profileImageUrl}
              name={fullName}
              className="h-16 w-16 border-2 border-background shadow-md ring-1 ring-border"
            />

            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-background',
                isPatientActive ? 'bg-emerald-500' : 'bg-zinc-500',
              )}
            >
              {isPatientActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-pulse" />
              )}
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {fullName}
              </h1>

              <StatusBadge status={isPatientActive ? 'ACTIVE' : 'BLOCKED'} size="md" />
            </div>

            <div className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Copy className="h-3 w-3 opacity-50 group-hover:opacity-100" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopyId}
                    className="cursor-pointer font-mono text-[11px] tracking-wide bg-muted/50 px-1.5 py-0.5 rounded transition-colors hover:text-primary"
                  >
                    ID: {shortId}
                  </button>
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
