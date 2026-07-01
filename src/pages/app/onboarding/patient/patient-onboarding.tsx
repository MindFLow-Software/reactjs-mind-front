import { Controller, useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Brain, Sparkles } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import { createPatientProfileByAccessCodeSchema } from '@/validators/patient-profile/form/create-patient-profile-by-access-code-schema'

import {
  Card,
  CardTitle,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useMutation } from '@tanstack/react-query'

export function PatientOnboardingPage() {
  const methods = useForm({
    resolver: zodResolver(createPatientProfileByAccessCodeSchema),
    defaultValues: {
      accessCode: '',
    }
  })

  const {
    control,
  } = methods

  const {} = useMutation({
    mutationKey: ['create-patient-profile-or-link-by-access-code'],
    mutationFn: async () => {},
    onSuccess: () => {},
    onError: () => {},
  })

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
          <h2 className="text-xl">Configurar como paciente</h2>
          <p className="text-sm">
            Um processo de integração tranquilo e cuidadoso.
          </p>
        </header>
        <Card className="p-4 gap-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles size={14} />
            Crie quantos perfis de paciente desejar
          </CardTitle>
          <CardContent className="p-0">
            <CardDescription className="text-sm">
              Preencha os dados da pessoa que utilizará este perfil.
              As informações serão usadas para te identificar e organizar seus atendimentos,
              consultas e histórico na plataforma.
            </CardDescription>
          </CardContent>
        </Card>
      </aside>
      <form
        className="flex flex-1"
      >
        <Card className="p-6 gap-2">
          <CardTitle className="flex items-center gap-2 text-2xl mb-0">
            <div className="flex items-center justify-center p-2 w-fit rounded-md text-white bg-blue-500/75">
              <Brain size={24} />
            </div>
            Seu perfil de paciente
          </CardTitle>
          <CardDescription className="mt-0">
            Seu psicólogo pode ter enviado um código para vincular seu perfil ao atendimento.
            Caso tenha recebido esse código, informe-o abaixo. Caso contrário, você pode finalizar o cadastro normalmente.
          </CardDescription>

          <CardContent className="p-0 flex-1 mb-8">
            <FieldGroup>
              <Controller
                name="accessCode"
                control={control}
                render={({ field }) => (
                  <Field className="gap-1">
                    <FieldLabel>Código de acesso</FieldLabel>
                    <Input
                      {...field}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex justify-between px-0 py-5 border-t-[0.5px] border-t-black/25 mt-auto">
            <p className="text-sm">
              Essas informações ajudam a identificar o paciente e vincular seus atendimentos.
            </p>
            <Button type="submit" className="gap-2">
              Finalizar
              <ArrowRight size={14} />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  )
}
