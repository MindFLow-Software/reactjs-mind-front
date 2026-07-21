import './patient-onboarding.css'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Brain, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  createPatientProfileByAccessCodeSchema,
  type CreatePatientProfileByAccessCodeData,
} from '@/validators/patient-profile/form/create-patient-profile-by-access-code-schema'

import {
  Card,
  CardTitle,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { IconBox } from '@/components/icon-box/icon-box'
import { TextInput } from '@/components/form-fields/text-input/text-input'

import { usePatientOnboardingSubmit } from './hooks/use-patient-onboarding-submit'

export function PatientOnboardingPage() {
  const methods = useForm<CreatePatientProfileByAccessCodeData>({
    resolver: zodResolver(createPatientProfileByAccessCodeSchema),
    defaultValues: {
      accessCode: '',
    },
  })

  const { submit, isSubmitting } = usePatientOnboardingSubmit()

  return (
    <main className="mx-auto mt-4 flex max-w-7xl gap-8">
      <aside className="flex max-w-72 flex-col gap-6">
        <Link to="/profiles" className="pob-back-link">
          <ArrowLeft size={14} />
          Voltar aos espaços de trabalho
        </Link>
        <header>
          <h2 className="text-xl">Configurar como paciente</h2>
          <p className="text-sm">
            Um processo de integração tranquilo e cuidadoso.
          </p>
        </header>
        <Card className="gap-2 p-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles size={14} />
            Crie quantos perfis de paciente desejar
          </CardTitle>
          <CardContent className="p-0">
            <CardDescription className="text-sm">
              Preencha os dados da pessoa que utilizará este perfil. As
              informações serão usadas para te identificar e organizar seus
              atendimentos, consultas e histórico na plataforma.
            </CardDescription>
          </CardContent>
        </Card>
      </aside>
      <Form {...methods}>
        <form className="flex flex-1" onSubmit={methods.handleSubmit(submit)}>
          <Card className="gap-2 p-6">
            <CardTitle className="mb-0 flex items-center gap-2 text-2xl">
              <IconBox icon={Brain} variant="primary" size="lg" />
              Seu perfil de paciente
            </CardTitle>
            <CardDescription className="mt-0">
              Seu psicólogo pode ter enviado um código para vincular seu perfil
              ao atendimento. Caso tenha recebido esse código, informe-o abaixo.
              Caso contrário, você pode finalizar o cadastro normalmente.
            </CardDescription>

            <CardContent className="mb-8 flex-1 p-0">
              <TextInput<CreatePatientProfileByAccessCodeData>
                name="accessCode"
                label="Código de acesso"
                placeholder="XXXX-XXXX-XXXX-XXXX"
              />
            </CardContent>

            <CardFooter className="pob-footer">
              <p className="text-sm">
                Essas informações ajudam a identificar o paciente e vincular
                seus atendimentos.
              </p>
              <Button disabled={isSubmitting} type="submit">
                Finalizar
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </main>
  )
}
