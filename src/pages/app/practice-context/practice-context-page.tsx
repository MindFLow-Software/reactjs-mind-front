import './practice-context-page.css'
import { useCallback, useState } from 'react'
import { Briefcase, Building2 } from 'lucide-react'

import {
  ContextType,
  type CreatePracticeContextBody,
} from '@/types/psychologist'

import { CreateClinicContext } from './components/create-clinic-context'
import { CreateIndividualContext } from './components/create-individual-context'
import {
  PracticeContextOptionCard,
  type PracticeContextOption,
} from './components/practice-context-option-card'
import { ActivePsychologistProfileBadge } from '@/pages/auth/components/active-psychologist-profile-badge'
import { useCreatePracticeContext } from './hooks/use-create-practice-context'

export function PracticeContextPage() {
  const [practiceContext, setPracticeContext] = useState<ContextType | null>(
    null,
  )

  const handleSetContextType = useCallback((contextType: ContextType) => {
    setPracticeContext(contextType)
  }, [])

  const handleGoBack = useCallback(() => {
    setPracticeContext(null)
  }, [])

  const { mutateAsync, isPending } = useCreatePracticeContext()

  const handleCreatePracticeContext = useCallback(
    async (data: CreatePracticeContextBody) => {
      await mutateAsync(data)
    },
    [mutateAsync],
  )

  const options: PracticeContextOption[] = [
    {
      accent: 'blue',
      titleIconVariant: 'primary',
      icon: <Briefcase />,
      title: 'INDIVIDUAL / PRIVADO',
      description: 'Você conduz suas próprias sessões',
      bullets: [
        'Defina sua própria taxa e disponibilidade',
        'Faturamento direto aos seus pacientes',
        'Sessões online ou presenciais',
      ],
      onSelect: () => handleSetContextType(ContextType.INDIVIDUAL),
    },
    {
      accent: 'teal',
      titleIconVariant: 'secondary',
      icon: <Building2 />,
      title: 'CLÍNICA / INSTITUIÇÃO',
      description: 'Participe de um espaço de trabalho por convite.',
      bullets: [
        'CRP e credenciais (pagamento único)',
        'Adicione vários espaços de trabalho posteriormente',
        'Ferramentas para prática calma e focada',
      ],
      onSelect: () => handleSetContextType(ContextType.CLINIC),
    },
  ]

  const renderPracticeContextForm = () => {
    switch (practiceContext) {
      case ContextType.INDIVIDUAL: {
        return (
          <CreateIndividualContext
            onGoBack={handleGoBack}
            onCreatePracticeContext={handleCreatePracticeContext}
            isSubmitting={isPending}
          />
        )
      }
      case ContextType.CLINIC: {
        return (
          <CreateClinicContext
            onGoBack={handleGoBack}
            onCreatePracticeContext={handleCreatePracticeContext}
          />
        )
      }
    }
  }

  return (
    <div className="pctx-shell">
      <div className="pctx-header">
        <header className="text-center space-y-2">
          <p className="font-medium text-muted-foreground">
            Contexto de atuação
          </p>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl">Onde você pratica?</h1>
            <p className="text-xs text-muted-foreground">
              Sua identidade profissional (CRP e credenciais) permanece a mesma
              em todos os seus espaços de trabalho. Escolha como deseja
              configurá-la — você pode adicionar mais informações a qualquer
              momento.
            </p>
          </div>
        </header>
        <ActivePsychologistProfileBadge />
      </div>

      <main className="w-full max-w-4xl">
        {!practiceContext ? (
          <div className="pctx-options-row">
            {options.map((option) => (
              <PracticeContextOptionCard key={option.title} option={option} />
            ))}
          </div>
        ) : (
          renderPracticeContextForm()
        )}
      </main>
    </div>
  )
}
