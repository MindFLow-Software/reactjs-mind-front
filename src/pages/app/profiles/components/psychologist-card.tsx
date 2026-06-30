import { memo } from 'react'
import { Brain, ArrowRight, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PsychologistProfile } from '@/types/psychologist'
import type { PracticeContextMe } from '../constants'
import './psychologist-card.css'

interface PsychologistCardProps {
  profile: PsychologistProfile | null
  practiceContexts: PracticeContextMe[]
  firstName: string
  lastName: string
  isActive: boolean
  onEnter: () => void
  onAddContext: () => void
  onCreateProfile: () => void
}

function renderPsychologistContent(props: PsychologistCardProps) {
  const { profile, practiceContexts, firstName, lastName, isActive, onEnter, onAddContext, onCreateProfile } = props

  switch (profile ? 'has-profile' : 'no-profile') {
    case 'has-profile':
      return (
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Perfil de psicólogo ativo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Seu perfil profissional já está configurado e pronto para uso.
            </p>
          </div>

          <div className="psy-info-grid rounded-lg bg-muted/50 p-4">
            <div>
              <p className="psy-info-label text-muted-foreground">STATUS</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={cn(
                    'size-2 rounded-full',
                    isActive ? 'bg-green-500' : 'bg-red-400',
                  )}
                />
                <span className="text-sm font-medium text-foreground">
                  {isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>

            <div>
              <p className="psy-info-label text-muted-foreground">CRP</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {profile!.crp}
              </p>
            </div>

            <div>
              <p className="psy-info-label text-muted-foreground">
                NOME PROFISSIONAL
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {firstName} {lastName}
              </p>
            </div>

            <div>
              <p className="psy-info-label text-muted-foreground">CONTEXTOS</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {practiceContexts.length} contexto(s)
              </p>
            </div>
          </div>

          <div className="psy-actions">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-950/30"
              onClick={onEnter}
            >
              Entrar no perfil de psicólogo
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button variant="outline" className="w-full" onClick={onAddContext}>
              <Plus className="mr-2 size-4" />
              Adicionar contexto
            </Button>
          </div>
        </>
      )

    case 'no-profile':
      return (
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Perfil de psicólogo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua identidade profissional uma única vez — depois adicione
              quantos contextos de prática precisar.
            </p>
          </div>

          <ul className="psy-feature-list">
            <li className="psy-feature-item text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
              CRP e credenciais validados
            </li>
            <li className="psy-feature-item text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
              Adicione vários espaços de trabalho
            </li>
            <li className="psy-feature-item text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
              Ferramentas para prática focada
            </li>
          </ul>

          <div className="psy-actions">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-950/30"
              onClick={onCreateProfile}
            >
              Criar perfil de psicólogo
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </>
      )
  }
}

function PsychologistCardBase(props: PsychologistCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="psy-card">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-blue-600" />

        <div className="psy-eyebrow mt-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <Brain className="size-5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Para profissionais licenciados
          </span>
        </div>

        {renderPsychologistContent(props)}
      </div>
    </Card>
  )
}

export const PsychologistCard = memo(PsychologistCardBase)
