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
          <div className="flex items-center gap-4">
            <Card className="relative w-full max-w-1/2 h-80 p-4 gap-1">
              <div className="absolute left-0 top-0 h-1 w-full bg-emerald-500" />
              <CardHeader className="p-0">
                <div className="flex items-center justify-center p-3 w-fit rounded-md text-white bg-emerald-500/75">
                  <Briefcase size={24} />
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <CardTitle className="text-xl">INDIVIDUAL / PRIVADO</CardTitle>
                <CardDescription className="text-xs">
                  Você conduz suas próprias sessões.
                </CardDescription>
                <ul className="space-y-2 flex-1">
                  <li className="text-sm">
                    - Defina sua própria taxa e disponibilidade
                  </li>
                  <li className="text-sm">
                    - Faturamento direto aos seus pacientes
                  </li>
                  <li className="text-sm">- Sessões online ou presenciais</li>
                </ul>
              </CardContent>
              <CardFooter className="p-0 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSetContextType(ContextType.INDIVIDUAL)}
                  className="justify-between bg-transparent border-none flex-1"
                >
                  Continuar
                  <div className="flex items-center justify-center p-3 w-fit rounded-full bg-neutral-200">
                    <ArrowRight className="size-4" />
                  </div>
                </Button>
              </CardFooter>
            </Card>

            <Card className="relative w-full max-w-1/2 h-80 p-4 gap-1">
              <div className="absolute left-0 top-0 h-1 w-full bg-blue-500" />
              <CardHeader className="p-0">
                <div className="flex items-center justify-center p-3 w-fit rounded-md text-white bg-blue-500/75">
                  <Building2 size={24} />
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <CardTitle className="text-xl">CLÍNICA / INSTITUIÇÃO</CardTitle>
                <CardDescription className="text-xs">
                  Participe de um espaço de trabalho por convite.
                </CardDescription>
                <ul className="space-y-2 flex-1">
                  <li className="text-sm">
                    - CRP e credenciais (pagamento único)
                  </li>
                  <li className="text-sm">
                    - Adicione vários espaços de trabalho posteriormente
                  </li>
                  <li className="text-sm">
                    - Ferramentas para prática calma e focada
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="p-0 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSetContextType(ContextType.CLINIC)}
                  className="justify-between bg-transparent border-none flex-1"
                >
                  Continuar
                  <div className="flex items-center justify-center p-3 w-fit rounded-full bg-neutral-200">
                    <ArrowRight className="size-4" />
                  </div>
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
