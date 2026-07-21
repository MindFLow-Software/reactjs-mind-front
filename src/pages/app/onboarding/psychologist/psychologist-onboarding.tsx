import './psychologist-onboarding.css'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Brain, Sparkles } from 'lucide-react'

import type z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'

import {
  Card,
  CardTitle,
  CardFooter,
  CardAction,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Expertise, Honorific } from '@/types/shared/enums'
import { queryKeys } from '@/constants/query-keys'
import { getProfile } from '@/api/auth/get-profile'
import { useFormData } from '@/hooks/use-form-data'
import { ProfessionalIdentityFormStep } from './steps/professional-identity-form-step/professional-identity-form-step'
import { createPsychologistProfileSchema } from '@/validators/psychologists/form/create-psychologist-profile-schema'
import { useCreatePsychologistProfile } from './hooks/use-create-psychologist-profile'

type ICreatePsychologistProfile = z.infer<
  typeof createPsychologistProfileSchema
>

const STEPS = [
  {
    order: 1,
    label: 'Identidade profissional',
  },
]

export function PsychologistOnboardingPage() {
  const navigate = useNavigate()

  const { data: me } = useQuery({
    queryKey: queryKeys.me,
    queryFn: getProfile,
  })

  const methods = useForm<ICreatePsychologistProfile>({
    resolver: zodResolver(
      createPsychologistProfileSchema,
    ) as Resolver<ICreatePsychologistProfile>,
    defaultValues: {
      professionalName: '',
      crp: '',
      expertise: Expertise.CLINICAL,
      honorific: Honorific.MASC_DR,
      languages: [],
      professionalBio: '',
    },
  })

  const { handleSubmit } = methods

  const [currentStep, setCurrentStep] = useState<number>(1)

  const formattedCurrentStep = useMemo(
    () => String(currentStep).padStart(2, '0'),
    [currentStep],
  )

  const stepsLength = STEPS.length

  const isLastStep = useMemo(
    () => currentStep === stepsLength,
    [currentStep, stepsLength],
  )

  const handleSetCurrentStep = (stepOrder: number) => {
    setCurrentStep(stepOrder)
  }

  const nextStep = () => {
    setCurrentStep((prevCurrentStep) =>
      prevCurrentStep >= stepsLength ? prevCurrentStep : prevCurrentStep + 1,
    )
  }

  const renderFormStep = () => {
    switch (currentStep) {
      case 1: {
        return <ProfessionalIdentityFormStep />
      }
    }
  }

  const { transform } = useFormData<ICreatePsychologistProfile>()

  const { isPending: isCreatingPsychologistProfile, mutateAsync } =
    useCreatePsychologistProfile()

  const handleCreatePsychologistProfile = async (
    data: ICreatePsychologistProfile,
  ) => {
    await mutateAsync(transform(data))
  }

  const alreadyHasPsychologistProfile = useMemo(
    () => Boolean(me?.psychologistProfile),
    [me],
  )

  useEffect(() => {
    if (alreadyHasPsychologistProfile) navigate('/profiles')
  }, [alreadyHasPsychologistProfile, navigate])

  const isDisabled = isCreatingPsychologistProfile

  return (
    <main className="flex gap-8 mx-auto max-w-7xl mt-4">
      <aside className="flex flex-col gap-6 max-w-72">
        <Link to="/profiles" className="psob-back-link">
          <ArrowLeft size={14} />
          Voltar aos espaços de trabalho
        </Link>
        <header>
          <h2 className="text-xl">Configurar como psicólogo</h2>
          <p className="text-sm">
            Um processo de integração tranquilo e cuidadoso. {STEPS.length}{' '}
            passos simples.
          </p>
        </header>
        <div className="flex flex-col gap-3">
          {STEPS.map((step) => (
            <Button
              key={step.order}
              variant="outline"
              onClick={() => handleSetCurrentStep(step.order)}
              className={cn(
                'psob-step-button',
                currentStep === step.order && 'psob-step-button-active',
              )}
            >
              <div className="psob-step-index">{step.order}</div>
              <span>{step.label}</span>
            </Button>
          ))}
        </div>
        <Card className="p-4 gap-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles size={14} />
            Uma vez é o suficiente
          </CardTitle>
          <CardContent className="p-0">
            <CardDescription className="text-sm">
              Solicitamos suas credenciais profissionais apenas uma vez. Sua
              identidade será reutilizada em todos os contextos de atuação que
              você adicionar.
            </CardDescription>
          </CardContent>
        </Card>
      </aside>
      <form
        className="flex flex-1"
        onSubmit={handleSubmit(handleCreatePsychologistProfile)}
      >
        <FormProvider {...methods}>
          <Card className="p-6 gap-2">
            <CardAction className="text-sm">
              Passo {formattedCurrentStep} de{' '}
              {String(stepsLength).padStart(2, '0')}
            </CardAction>
            <CardTitle className="flex items-center gap-2 text-2xl mb-0">
              <div className="psob-icon-badge">
                <Brain size={24} />
              </div>
              Sua identidade profissional
            </CardTitle>
            <CardDescription className="mt-0">
              Utilizado em todos os seus espaços de trabalho. Verificamos seu
              CRP junto ao Conselho Federal de Psicologia.
            </CardDescription>

            <CardContent className="p-0 flex-1 mb-8">
              {renderFormStep()}
            </CardContent>
            <CardFooter className="psob-footer">
              <p className="text-sm">
                Essas informações são reutilizadas em todos os contextos de
                atuação.
              </p>
              {isLastStep ? (
                <Button disabled={isDisabled} type="submit" className="gap-2">
                  Finalizar
                  <ArrowRight size={14} />
                </Button>
              ) : (
                <Button
                  disabled={isDisabled}
                  type="button"
                  onClick={nextStep}
                  className="gap-2"
                >
                  Continuar
                  <ArrowRight size={14} />
                </Button>
              )}
            </CardFooter>
          </Card>
        </FormProvider>
      </form>
    </main>
  )
}
