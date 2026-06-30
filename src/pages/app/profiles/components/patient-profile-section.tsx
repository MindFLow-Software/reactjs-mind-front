import { memo, useCallback } from 'react'
import { CircleUserRound, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { IpatientProfile } from '@/types/patient-profile'
import './patient-profile-section.css'

interface PatientProfileCardProps {
  profile: IpatientProfile
  onEnter: (id: string) => void
}

function PatientProfileCardBase({ profile, onEnter }: PatientProfileCardProps) {
  const handleClick = useCallback(() => onEnter(profile.id), [profile.id, onEnter])

  const isActive = profile.isActive
  const subtitle = profile.psychologistPracticeContextId
    ? 'Vinculado a um psicólogo'
    : 'Meu perfil'

  return (
    <Card className="pps2-card overflow-hidden p-0">
      <div className="pps2-card-header">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400">
          <CircleUserRound className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            isActive
              ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
              : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
          )}
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              isActive ? 'bg-green-500' : 'bg-red-400',
            )}
          />
          {isActive ? 'Ativo' : 'Inativo'}
        </div>
      </div>

      <div className="pps2-card-footer">
        <Button
          className="w-full bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-950/30"
          onClick={handleClick}
        >
          Entrar no perfil de paciente
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </Card>
  )
}

const PatientProfileCard = memo(PatientProfileCardBase)

interface PatientProfileSectionProps {
  profiles: IpatientProfile[]
  onEnter: (id: string) => void
}

export function PatientProfileSection({
  profiles,
  onEnter,
}: PatientProfileSectionProps) {
  if (profiles.length === 0) return null

  return (
    <div className="pps2-wrapper">
      <div className="pps2-section-header">
        <span className="pps2-eyebrow text-muted-foreground">PACIENTES</span>
        <h2 className="pps2-section-title text-foreground">
          Seus perfis de paciente
        </h2>
        <p className="pps2-section-subtitle text-muted-foreground">
          Escolha um perfil para acompanhar atendimentos, informações e
          evolução.
        </p>
      </div>

      <div className="pps2-cards">
        {profiles.map((profile) => (
          <PatientProfileCard
            key={profile.id}
            profile={profile}
            onEnter={onEnter}
          />
        ))}
      </div>
    </div>
  )
}
