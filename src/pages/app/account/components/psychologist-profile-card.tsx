'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ArrowRight, ShieldCheck, UserRoundPen } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { Mask } from '@/utils/mask'
import { ROLE_TRANSLATIONS } from '@/utils/mappers'
import { translatedExpertise } from '@/constants/translated-expertise'
import { fn } from '@/utils/fn'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ProfileCard } from '@/components/profile-card'

import { EditPsychologistProfile } from './edit-psychologist-profile-dialog'
import { PsychologistAvatarUpload } from './psychologist-avatar-upload'

import './psychologist-profile-card.css'

export function PsychologistProfileCard() {
  const navigate = useNavigate()
  const { profile: me, isPending: isLoading } = useAuth()

  const [isEditOpen, setIsEditOpen] = useState(false)

  if (isLoading || !me) {
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

  const psychologistProfile = me.psychologistProfile
  const hasPsychologistProfile = Boolean(psychologistProfile)

  const professionalName =
    psychologistProfile?.professionalName ?? 'Perfil profissional não criado'

  const translatedRole = (() => {
    return ROLE_TRANSLATIONS[me.platformRole] || me.platformRole
  })()

  const expertiseLabel = fn.one(
    psychologistProfile?.expertise,
    translatedExpertise,
    'Não informado',
  )

  const handleRedirectToCreatePsychologistProfile = () => {
    navigate('/onboarding/psychologist')
  }

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
            currentImage={me.profileImageUrl}
            fullName={professionalName}
          />

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-foreground">
              {professionalName}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {expertiseLabel}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {translatedRole}
              </span>
            </div>
          </div>

          {hasPsychologistProfile && (
            <div className="acc-verified-badge">
              <ShieldCheck
                size={14}
                className="text-blue-600 dark:text-blue-400"
              />
              Conta Verificada
            </div>
          )}
        </div>

        <div className="pf-stat-grid">
          <div>
            <p className="pf-stat-label">e-mail</p>
            <p className="pf-stat-value truncate">{me.email}</p>
          </div>

          <div>
            <p className="pf-stat-label">telefone</p>
            <p className="pf-stat-value">{Mask.phone(me.phoneNumber)}</p>
          </div>

          <div>
            <p className="pf-stat-label">cpf</p>
            <p className="pf-stat-value">{Mask.cpf(me.cpf)}</p>
          </div>

          <div>
            <p className="pf-stat-label">crp</p>
            <p className="pf-stat-value">
              {psychologistProfile?.crp || 'Não informado'}
            </p>
          </div>
        </div>

        {!hasPsychologistProfile && (
          <p className="text-xs text-muted-foreground">
            Cadastre seu CRP e configure suas informações profissionais para
            começar a atender.
          </p>
        )}
      </ProfileCard.Content>

      <ProfileCard.Footer>
        {hasPsychologistProfile ? (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="pf-cta-btn pf-cta-btn--primary">
                Editar Perfil
                <ArrowRight size={16} />
              </Button>
            </DialogTrigger>

            <EditPsychologistProfile
              onClose={() => setIsEditOpen(false)}
              psychologistProfileId={psychologistProfile?.id ?? null}
            />
          </Dialog>
        ) : (
          <Button
            type="button"
            className="pf-cta-btn pf-cta-btn--primary"
            onClick={handleRedirectToCreatePsychologistProfile}
          >
            Criar perfil de psicólogo
            <ArrowRight size={16} />
          </Button>
        )}
      </ProfileCard.Footer>
    </ProfileCard>
  )
}
