import { useNavigate } from 'react-router-dom'
import { ArrowRight, Brain, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

import { Button } from '@/components/ui/button'
import { ProfileCard } from './profile-card'

import './psychologist-card.css'

export function PsychologistCard() {
  const navigate = useNavigate()

  const { profile: me } = useAuth()

  const handleCreatePsychologistProfile = () => {
    navigate('/onboarding/psychologist')
  }

  const handleAddContext = () => {
    navigate('/profiles/context')
  }

  const hasPsychologistProfile = Boolean(me?.psychologistProfile)

  return (
    <ProfileCard.Root>
      <ProfileCard.Header
        icon={<Brain />}
        label="Para profissionais licenciados"
      />

      <ProfileCard.Content>
        {hasPsychologistProfile ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Perfil de psicólogo ativo
              </h2>
              <p className="text-sm text-muted-foreground">
                Seu perfil profissional já está configurado e pronto para uso.
              </p>
            </div>

            <div className="pf-stat-grid">
              <div>
                <p className="pf-stat-label">status</p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'size-2 rounded-full',
                      me?.isActive ? 'bg-green-500' : 'bg-red-400',
                    )}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {me?.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              <div>
                <p className="pf-stat-label">crp</p>
                <p className="pf-stat-value">{me?.psychologistProfile!.crp}</p>
              </div>

              <div>
                <p className="pf-stat-label">nome profissional</p>
                <p className="pf-stat-value">
                  {me?.psychologistProfile?.professionalName}
                </p>
              </div>

              <div>
                <p className="pf-stat-label">contextos</p>
                <p className="pf-stat-value">
                  {me?.practiceContexts.length} contexto(s)
                </p>
              </div>
            </div>
          </>
        ) : (
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

            <ul className="pf-feature-list">
              <li className="pf-feature-item">
                <span className="pf-feature-dot pf-feature-dot--primary" />
                CRP e credenciais validados
              </li>
              <li className="pf-feature-item">
                <span className="pf-feature-dot pf-feature-dot--primary" />
                Adicione vários espaços de trabalho
              </li>
              <li className="pf-feature-item">
                <span className="pf-feature-dot pf-feature-dot--primary" />
                Ferramentas para prática focada
              </li>
            </ul>
          </>
        )}
      </ProfileCard.Content>

      <ProfileCard.Footer>
        {hasPsychologistProfile ? (
          <Button
            className="w-full"
            variant="outline"
            onClick={handleAddContext}
          >
            <Plus className="mr-2 size-4" />
            Adicionar contexto
          </Button>
        ) : (
          <Button
            className="pf-cta-btn pf-cta-btn--primary"
            onClick={handleCreatePsychologistProfile}
          >
            Criar perfil de psicólogo
            <ArrowRight className="ml-2 size-4" />
          </Button>
        )}
      </ProfileCard.Footer>
    </ProfileCard.Root>
  )
}
