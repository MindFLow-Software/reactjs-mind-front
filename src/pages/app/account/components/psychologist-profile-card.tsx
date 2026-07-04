'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/api/psychologists/get-profile'
import type { IMeResponse } from '@/types/me'
import type { UpdatePsychologistBody } from '@/api/psychologists/update-psychologist'
import { PsychologistAvatarUpload } from './psychologist-avatar-upload'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Mail,
  Phone,
  FileText,
  Award,
  ChevronRight,
  Calendar,
  UserRoundPen,
} from 'lucide-react'
import { formatPhone } from '@/utils/formatPhone'
import { formatCPF } from '@/utils/formatCPF'
import { ROLE_TRANSLATIONS, EXPERTISE_TRANSLATIONS } from '@/utils/mappers'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { EditPsychologistProfile } from './edit-psychologist-dialog'
import { AccountStatChip } from './account-stat-chip'
import './psychologist-profile-card.css'

interface PsychologistProfileCardProps {
  psychologist?: IMeResponse
}

export function PsychologistProfileCard({
  psychologist: initialData,
}: PsychologistProfileCardProps = {}) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data: profile, isLoading } = useQuery<IMeResponse>({
    queryKey: ['psychologist-profile'],
    queryFn: getProfile,
    initialData,
    staleTime: Number.POSITIVE_INFINITY,
  })

  if (isLoading && !profile) {
    return (
      <div className="acc-profile-card">
        <div className="h-24 bg-muted animate-pulse" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col md:flex-row items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full ring-4 ring-card" />
            <div className="flex-1 flex flex-col gap-3 w-full pt-8">
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const fullName = `${profile.firstName} ${profile.lastName}`

  const translatedRole = (() => {
    const gender = String(profile.gender).toUpperCase()
    const isFemale = gender === 'FEMALE'
    const suffix = isFemale ? 'a' : 'o'

    if (profile.psychologistProfile) {
      return `Psicólog${suffix}`
    }

    return ROLE_TRANSLATIONS[profile.platformRole] || profile.platformRole
  })()

  const expertise = profile.psychologistProfile?.expertise ?? ''
  const translatedExpertise =
    EXPERTISE_TRANSLATIONS[expertise] || expertise || 'Não informado'

  return (
    <div className="acc-profile-card">
      <div className="acc-profile-banner" />

      <div className="acc-profile-body">
        <div className="acc-profile-header">
          <div className="acc-profile-avatar-ring">
            <PsychologistAvatarUpload
              currentImage={profile.profileImageUrl}
              fullName={fullName}
            />
          </div>

          <div className="acc-profile-name-block">
            <h2 className="acc-profile-name">{fullName}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {translatedExpertise}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30 hidden md:block" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {translatedRole}
              </span>
            </div>
          </div>

          <div className="acc-profile-verified">
            <div className="flex">
              <div className="acc-profile-verified-icon bg-blue-100">
                <UserRoundPen className="h-3 w-3 text-blue-600" />
              </div>
              <div className="acc-profile-verified-icon -ml-2 bg-purple-100">
                <Calendar className="h-3 w-3 text-purple-600" />
              </div>
            </div>
            <span className="text-xs font-medium text-muted-foreground ml-2">
              Conta Verificada
            </span>
          </div>
        </div>

        <div className="acc-profile-stats-grid">
          <AccountStatChip
            icon={<Mail className="h-4 w-4" />}
            accent="blue"
            label="E-mail"
            value={profile.email}
          />
          <AccountStatChip
            icon={<Phone className="h-4 w-4" />}
            accent="indigo"
            label="Telefone"
            value={formatPhone(profile.phoneNumber)}
          />
          <AccountStatChip
            icon={<FileText className="h-4 w-4" />}
            accent="purple"
            label="CPF"
            value={formatCPF(profile.cpf)}
          />
          <AccountStatChip
            icon={<Award className="h-4 w-4" />}
            accent="neutral"
            label="CRP"
            value={profile.psychologistProfile?.crp || 'Não informado'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mt-8 pt-6 border-t border-border/50">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <button className="group acc-profile-edit-trigger">
                <div className="flex items-center gap-4">
                  <div className="acc-profile-edit-icon">
                    <UserRoundPen className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-foreground block">
                      Editar Perfil
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">
                      Informações básicas
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            </DialogTrigger>
            <EditPsychologistProfile
              psychologist={{
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email ?? '',
                phoneNumber: profile.phoneNumber ?? '',
                crp: profile.psychologistProfile?.crp ?? null,
                expertise: profile.psychologistProfile
                  ?.expertise as UpdatePsychologistBody['expertise'],
              }}
              onClose={() => setIsEditOpen(false)}
            />
          </Dialog>
        </div>
      </div>
    </div>
  )
}
