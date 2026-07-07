'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Mail,
  Phone,
  Award,
  FileText,
  Calendar,
  UserPlus,
  UserRoundPen,
  ChevronRight,
} from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { formatCPF } from '@/utils/formatCPF'
import { formatPhone } from '@/utils/formatPhone'
import { ROLE_TRANSLATIONS, EXPERTISE_TRANSLATIONS } from '@/utils/mappers'

import { Skeleton } from '@/components/ui/skeleton'

import { AccountStatChip } from './account-stat-chip'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { EditPsychologistProfile } from './edit-psychologist-profile-dialog'
import { PsychologistAvatarUpload } from './psychologist-avatar-upload'

import './psychologist-profile-card.css'

export function PsychologistProfileCard() {
  const navigate = useNavigate()
  const { profile: me, isPending: isLoading } = useAuth()

  const [isEditOpen, setIsEditOpen] = useState(false)

  if (isLoading || !me) {
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

  const psychologistProfile = me?.psychologistProfile
  const hasPsychologistProfile = Boolean(me?.psychologistProfile)

  const professionalName = psychologistProfile?.professionalName ?? 'Perfil profissional não criado'

  const translatedRole = (() => {
    return ROLE_TRANSLATIONS[me.platformRole] || me.platformRole
  })()

  const expertise = psychologistProfile?.expertise ?? ''
  const translatedExpertise =
    EXPERTISE_TRANSLATIONS[expertise] || expertise || 'Não informado'

  const handleRedirectToCreatePsychologistProfile = () => {
    navigate('/onboarding/psychologist')
  }

  return (
    <div className="acc-profile-card">
      <div className="acc-profile-header">
        <PsychologistAvatarUpload
          currentImage={me.profileImageUrl}
          fullName={professionalName}
        />

        <div className="acc-profile-name-block">
          <h2 className="acc-profile-name">{professionalName}</h2>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
              {translatedExpertise}
            </span>
            <span className="size-1 rounded-full bg-white hidden md:block" />
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
              {translatedRole}
            </span>
          </div>
        </div>

        <div className="acc-profile-verified">
          <div className="flex">
            <div className="acc-profile-verified-icon bg-blue-200">
              <UserRoundPen className="size-3 text-blue-600" />
            </div>
            <div className="acc-profile-verified-icon -ml-2 bg-purple-200">
              <Calendar className="size-3 text-purple-600" />
            </div>
          </div>
          <span className="text-xs font-medium text-white/90 ml-2">
            Conta Verificada
          </span>
        </div>
      </div>

      <div className="acc-profile-body">
        <div className="acc-profile-stats-grid">
          <AccountStatChip
            icon={<Mail className="size-4" />}
            accent="blue"
            label="E-mail"
            value={me.email}
          />
          <AccountStatChip
            icon={<Phone className="size-4" />}
            accent="indigo"
            label="Telefone"
            value={formatPhone(me.phoneNumber)}
          />
          <AccountStatChip
            icon={<FileText className="size-4" />}
            accent="purple"
            label="CPF"
            value={formatCPF(me.cpf)}
          />
          <AccountStatChip
            icon={<Award className="size-4" />}
            accent="neutral"
            label="CRP"
            value={psychologistProfile?.crp || 'Não informado'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 pt-4 border-t border-border/50">
          {hasPsychologistProfile ? (
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <button className="group acc-profile-edit-trigger">
                  <div className="flex items-center gap-4">
                    <div className="acc-profile-edit-icon">
                      <UserRoundPen className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-foreground block">
                        Editar Perfil
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">
                        Informações básicas
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              </DialogTrigger>

              <EditPsychologistProfile
                psychologistProfile={{
                  crp: me.psychologistProfile?.crp,
                  expertise: me.psychologistProfile?.expertise,
                }}
                onClose={() => setIsEditOpen(false)}
              />
            </Dialog>
          ) : (
            <button
              className="group acc-profile-edit-trigger"
              onClick={handleRedirectToCreatePsychologistProfile}
            >
              <div className="flex items-center gap-4">
                <div className="acc-profile-edit-icon">
                  <UserPlus className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-sm text-foreground block">
                    Criar perfil de psicólogo
                  </span>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium max-w-4/5">
                    Cadastre seu CRP e configure suas informações profissionais para começar a atender.
                  </p>
                </div>
              </div>
              <ChevronRight
                className="size-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
