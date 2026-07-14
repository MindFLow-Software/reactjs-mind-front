import './practice-context-page.css'

import { useCallback, useState } from 'react'
import { Briefcase, Building2 } from 'lucide-react'

import { ContextType } from '@/types/psychologist/context-type'
import type { ICreatePracticeContextBody } from '@/types/psychologist/create-practice-context-body'

import { CreateClinicContext } from './components/create-clinic-context'
import { CreateIndividualContext } from './components/create-individual-context'
import { PracticeContextHeader } from './components/practice-context-header'
import {
  PracticeTypeCard,
  type IPracticeTypeCardOption,
} from './components/practice-type-card'
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
    async (data: ICreatePracticeContextBody) => {
      await mutateAsync(data)
    },
    [mutateAsync],
  )

  const typeOptions: IPracticeTypeCardOption[] = [
    {
      variant: 'individual',
      icon: Briefcase,
      title: 'INDIVIDUAL / PRIVADO',
      description: 'Você conduz suas próprias sessões.',
      bullets: [
        'Defina sua própria taxa e disponibilidade',
        'Faturamento direto aos seus pacientes',
        'Sessões online ou presenciais',
      ],
      onContinue: () => handleSetContextType(ContextType.INDIVIDUAL),
    },
    {
      variant: 'clinic',
      icon: Building2,
      title: 'CLÍNICA / INSTITUIÇÃO',
      description: 'Participe de um espaço de trabalho por convite.',
      bullets: [
        'CRP e credenciais (cadastro único)',
        'Adicione vários espaços de trabalho posteriormente',
        'Ferramentas para prática calma e focada',
      ],
      onContinue: () => handleSetContextType(ContextType.CLINIC),
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
    <div className="pc-wrap">
      <PracticeContextHeader />

      {!practiceContext ? (
        <div className="pc-types">
          {typeOptions.map((option) => (
            <PracticeTypeCard key={option.variant} option={option} />
          ))}
        </div>
      ) : (
        renderPracticeContextForm()
      )}
    </div>
  )
}
