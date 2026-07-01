import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Briefcase, Building2 } from 'lucide-react'

import { toast } from 'sonner'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import {
  ContextType,
  type CreatePracticeContextBody,
} from '@/types/psychologist'

import { CreateClinicContext } from './components/create-clinic-context'
import { createPracticeContext } from '@/api/auth/create-practice-context'
import { CreateIndividualContext } from './components/create-individual-context'
import { ActivePsychologistProfileBadge } from '@/pages/auth/components/active-psychologist-profile-badge'
import { TitleIcon } from '@/components/title-icon'

export function PracticeContextPage() {
  const navigate = useNavigate()

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
    onSuccess: () => {
      toast.success('Contexto de atuação criado')
      navigate('/profiles')
    },
    onError: () => {
      toast.error('Erro ao criar contexto de atuação')
    },
  })

  const handleCreatePracticeContext = async (
    data: CreatePracticeContextBody,
  ) => {
    await mutateAsync(data)
  }

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
    <div className="flex flex-col items-center justify-center mx-auto mt-4">
      <div className="flex flex-col items-center justify-center max-w-xl">
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
          <div className="flex items-center gap-4 h-80">
            <Card className="relative w-full max-w-1/2 h-full p-4 gap-1">
              <div className="absolute left-0 top-0 h-1 w-full bg-blue-500" />
              <CardHeader className="flex items-center gap-2 p-0">
                <TitleIcon variant="primary">
                  <Briefcase />
                </TitleIcon>
                <CardTitle className="text-xl">INDIVIDUAL / PRIVADO</CardTitle>
              </CardHeader>
              <CardContent className="px-0 h-full space-y-6">
                <CardDescription>Você conduz suas próprias sessões</CardDescription>
                <ul className="flex flex-col justify-center flex-1 gap-2">
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                    Defina sua própria taxa e disponibilidade
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                    Faturamento direto aos seus pacientes
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                    Sessões online ou presenciais
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="p-0 h-fit">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSetContextType(ContextType.INDIVIDUAL)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white dark:hover:bg-blue-950/30"
                >
                  Continuar
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="relative w-full max-w-1/2 h-full p-4 gap-1">
              <div className="absolute left-0 top-0 h-1 w-full bg-teal-500" />
              <CardHeader className="flex items-center gap-2 p-0">
                <TitleIcon variant="secondary">
                  <Building2 />
                </TitleIcon>
                <CardTitle className="text-xl">CLÍNICA / INSTITUIÇÃO</CardTitle>
              </CardHeader>
              <CardContent className="px-0 h-full space-y-6">
                <CardDescription>
                  Participe de um espaço de trabalho por convite.
                </CardDescription>
                <ul className="flex flex-col justify-center gap-2">
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
                    CRP e credenciais (pagamento único)
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
                    Adicione vários espaços de trabalho posteriormente
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
                    Ferramentas para prática calma e focada
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="p-0 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSetContextType(ContextType.CLINIC)}
                  className="flex items-center gap-2 w-full bg-teal-600 text-white hover:bg-teal-700 hover:text-white dark:hover:bg-teal-950/30"
                >
                  Continuar
                  <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          renderPracticeContextForm()
        )}
      </main>
    </div>
  )
}
