import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Brain, Sparkles } from 'lucide-react'

import type z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Card,
  CardTitle,
  CardFooter,
  CardAction,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Expertise } from '@/types/expertise'
import { Honorific } from '@/types/psychologist'
import { getProfile } from '@/api/psychologists/get-profile'
import { createPsychologistProfile } from '@/api/auth/create-psychologist-profile'
import { ProfessionalIdentityFormStep } from './steps/professional-identity-form-step'
import { createPsychologistProfileSchema } from '@/validators/psychologist-profile'

type IcreatePsychologistProfile = z.infer<
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
    queryKey: ['me'],
    queryFn: getProfile,
  })

  const methods = useForm<IcreatePsychologistProfile>({
    resolver: zodResolver(
      createPsychologistProfileSchema,
    ) as Resolver<IcreatePsychologistProfile>,
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

  const { isPending: isCreatingPsychologistProfile, mutateAsync } = useMutation(
    {
      mutationKey: ['create-psychologist-profile'],
      mutationFn: createPsychologistProfile,
      onError: (error) => {
        console.log('Error: ', error)
      },
    },
  )

  const handleCreatePsychologistProfile = async (
    data: IcreatePsychologistProfile,
  ) => {
    await mutateAsync(data)
  }

  const alreadyHasPsychologistProfile = useMemo(
    () => Boolean(me?.psychologistProfile),
    [me],
  )

  if (alreadyHasPsychologistProfile) navigate('/profiles')

  const isDisabled = isCreatingPsychologistProfile

  return (
    <main className="flex gap-8 mx-auto max-w-7xl mt-4">
      <aside className="flex flex-col gap-6 max-w-72">
        <Link
          to="/profiles"
          className="text-xs flex items-center gap-1 cursor-pointer text-black"
        >
          <ArrowLeft size={14} />
          Voltar aos espaços de trabalho
        </Link>
        <header>
          <h2 className="text-xl">Configurar como psicólogo</h2>
          <p className="text-sm">
            Um processo de integração tranquilo e cuidadoso. {STEPS.length} passos
            simples.
          </p>
        </header>
        <div className="flex flex-col gap-3">
          {STEPS.map((step) => (
            <Button
              key={step.order}
              variant="outline"
              onClick={() => handleSetCurrentStep(step.order)}
              className={`justify-start gap-2 ${currentStep === step.order && 'bg-blue-200 border border-blue-400 hover:bg-blue-300'}`}
            >
              <div className="rounded-full flex items-center justify-center p-3.5 size-4 bg-blue-500 text-white">
                {step.order}
              </div>
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
              <div className="flex items-center justify-center p-2 w-fit rounded-md text-white bg-blue-500/75">
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
            <CardFooter className="flex justify-between px-0 py-5 border-t-[0.5px] border-t-black/25 mt-auto">
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
