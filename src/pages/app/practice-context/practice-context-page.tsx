import './practice-context-page.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Briefcase, Building2 } from 'lucide-react'

import { toast } from 'sonner'
import { AxiosError } from 'axios'

import {
  ContextType,
  type CreatePracticeContextBody,
} from '@/types/psychologist'

import { CreateClinicContext } from './components/create-clinic-context'
import { createPracticeContext } from '@/api/auth/create-practice-context'
import { CreateIndividualContext } from './components/create-individual-context'
import { PracticeContextHeader } from './components/practice-context-header'
import {
  PracticeTypeCard,
  type IPracticeTypeCardOption,
} from './components/practice-type-card'

export function PracticeContextPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [practiceContext, setPracticeContext] = useState<ContextType | null>(
    null,
  )

  const handleSetContextType = (contextType: ContextType) => {
    setPracticeContext(contextType)
  }

  const handleGoBack = () => {
    setPracticeContext(null)
  }

  const { mutateAsync } = useMutation({
    mutationKey: ['create-psychologist-practice-context'],
    mutationFn: createPracticeContext,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Contexto de atuação criado')
      navigate('/profiles')
    },
    onError: (error) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.message
          : 'Erro ao criar contexto de atuação'

      toast.error(errorMessage)
    },
  })

  const handleCreatePracticeContext = async (
    data: CreatePracticeContextBody,
  ) => {
    await mutateAsync(data)
  }

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
            onCreatPracticeContext={handleCreatePracticeContext}
          />
        )
      }
      case ContextType.CLINIC: {
        return (
          <CreateClinicContext
            onGoBack={handleGoBack}
            onCreatPracticeContext={handleCreatePracticeContext}
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
