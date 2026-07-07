'use client'

import { useState } from 'react'

import { ShieldCheck, UserRoundPen, ArrowRight } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { formatCPF } from '@/utils/formatCPF'
import { formatPhone } from '@/utils/formatPhone'
import { ROLE_TRANSLATIONS, EXPERTISE_TRANSLATIONS } from '@/utils/mappers'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ProfileCard } from '@/components/profile-card'

import { EditPsychologistProfile } from './edit-psychologist-dialog'
import { PsychologistAvatarUpload } from './psychologist-avatar-upload'

import './psychologist-profile-card.css'

export function PsychologistProfileCard() {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { profile, isPending: isLoading } = useAuth()

  if (isLoading || !profile) {
    return (
      <ProfileCard>
        <ProfileCard.Header
          icon={<UserRoundPen />}
          label="Seu perfil profissional"
          variant="primary"
        />
        <ProfileCard.Content>
          <div className="acc-identity-row">
            <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </ProfileCard.Content>
      </ProfileCard>
    )
  }

  const fullName = `${profile.firstName} ${profile.lastName}`

  const translatedRole = (() => {
    return ROLE_TRANSLATIONS[profile.platformRole] || profile.platformRole
  })()

  const expertise = profile.psychologistProfile?.expertise ?? ''
  const translatedExpertise =
    EXPERTISE_TRANSLATIONS[expertise] || expertise || 'Não informado'

  return (
    <ProfileCard>
      <ProfileCard.Header
        icon={<UserRoundPen />}
        label="Seu perfil profissional"
        variant="primary"
      />
      <ProfileCard.Content>
        <div className="acc-identity-row">
          <PsychologistAvatarUpload
            currentImage={profile.profileImageUrl}
            fullName={fullName}
          />

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-foreground">
              {fullName}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {translatedExpertise}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {translatedRole}
              </span>
            </div>
          </div>

          <div className="acc-verified-badge">
            <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" />
            Conta Verificada
          </div>
        </div>

        <div className="pf-stat-grid">
          <div>
            <p className="pf-stat-label">e-mail</p>
            <p className="pf-stat-value truncate">{profile.email}</p>
          </div>

          <div>
            <p className="pf-stat-label">telefone</p>
            <p className="pf-stat-value">{formatPhone(profile.phoneNumber)}</p>
          </div>

          <div>
            <p className="pf-stat-label">cpf</p>
            <p className="pf-stat-value">{formatCPF(profile.cpf)}</p>
          </div>

          <div>
            <p className="pf-stat-label">crp</p>
            <p className="pf-stat-value">
              {profile.psychologistProfile?.crp || 'Não informado'}
            </p>
          </div>
        </div>
      </ProfileCard.Content>

      <ProfileCard.Footer>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button type="button" className="pf-cta-btn pf-cta-btn--primary">
              Editar Perfil
              <ArrowRight size={16} />
            </Button>
          </DialogTrigger>

          <EditPsychologistProfile
            psychologist={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email ?? '',
              phoneNumber: profile.phoneNumber ?? '',
              crp: profile.psychologistProfile?.crp ?? null,
              expertise: profile.psychologistProfile?.expertise,
            }}
            onClose={() => setIsEditOpen(false)}
          />
        </Dialog>
      </ProfileCard.Footer>
    </ProfileCard>
  )
}
