import './psychologist-card.css'

import { memo } from 'react'
import { ArrowRight, Brain, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type {
  PsychologistProfile,
  PsychologistPracticeContext,
} from '@/types/psychologist'

import { ProfileCard } from './profile-card'

interface PsychologistCardProps {
  profile: PsychologistProfile | null
  practiceContexts: PsychologistPracticeContext[]
  onEnter: () => void
  onAddContext: () => void
  onCreateProfile: () => void
}

function renderPsychologistContent(props: PsychologistCardProps) {
  const { profile, practiceContexts } = props

  switch (profile === null ? 'no-profile' : 'has-profile') {
    case 'no-profile':
      return (
        <>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Perfil de psicólogo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua identidade profissional uma única vez — depois adicione
              quantos contextos de prática precisar.
            </p>
          </div>
          <ul className="space-y-2">
            <li className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              CRP e credenciais validados
            </li>
            <li className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              Adicione vários espaços de trabalho
            </li>
            <li className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              Ferramentas para prática focada
            </li>
          </ul>
        </>
      )

    case 'has-profile':
      return (
        <>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Perfil de psicólogo ativo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Seu perfil profissional já está configurado e pronto para uso.
            </p>
          </div>
          <div className="psy-info-grid">
            <div>
              <p className="psy-info-label">CRP</p>
              <p className="psy-info-value">{profile!.crp}</p>
            </div>
            <div>
              <p className="psy-info-label">NOME PROFISSIONAL</p>
              <p className="psy-info-value">{profile!.professionalName}</p>
            </div>
            <div>
              <p className="psy-info-label">CONTEXTOS</p>
              <p className="psy-info-value">
                {practiceContexts.length} contexto(s)
              </p>
            </div>
          </div>
        </>
      )
  }
}

function PsychologistCardBase(props: PsychologistCardProps) {
  const { profile, onEnter, onAddContext, onCreateProfile } = props

  return (
    <ProfileCard variant="primary">
      <ProfileCard.Header
        icon={<Brain />}
        label="Para profissionais licenciados"
        variant="primary"
      />
      <ProfileCard.Content>
        {renderPsychologistContent(props)}
      </ProfileCard.Content>
      <ProfileCard.Footer>
        {profile === null ? (
          <Button className="w-full group" onClick={onCreateProfile}>
            Criar perfil de psicólogo
            <ArrowRight
              size={16}
              className="group-hover:translate-x-[3px] transition-transform duration-150"
            />
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button className="flex-1 group" onClick={onEnter}>
              Entrar no perfil de psicólogo
              <ArrowRight
                size={16}
                className="group-hover:translate-x-[3px] transition-transform duration-150"
              />
            </Button>
            <Button variant="outline" onClick={onAddContext}>
              <Plus size={16} />
              Adicionar contexto
            </Button>
          </div>
        )}
      </ProfileCard.Footer>
    </ProfileCard>
  )
}

export const PsychologistCard = memo(PsychologistCardBase)
