import { useNavigate, useParams } from 'react-router-dom'
import { useForm, type Resolver } from 'react-hook-form'
import { UserCheck, ShieldCheck } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import { useRegistrationLink } from '@/hooks/use-registration-link'
import { translatedHonorific } from '@/constants/translated-honorific'
import { useRegisterPatientViaRegistrationLink } from './hooks/use-register-patient-via-registration-link'

import {
  registerPatientViaRegistrationLinkSchema,
  type RegisterPatientViaRegistrationLinkData,
} from '@/validators/register-patient-via-registration-link/form/register-patient-via-registration-link-schema'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { FieldSeparator } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { EmailInput } from '@/components/form-fields/email-input/email-input'
import { PasswordInput } from '@/components/form-fields/password-input/password-input'
import { PhoneInput } from '@/components/form-fields/phone-input/phone-input'
import { CpfInput } from '@/components/form-fields/cpf-input/cpf-input'
import { DateInput } from '@/components/form-fields/date-input/date-input'
import { GenderSelectInput } from '@/components/form-fields/gender-select-input/gender-select-input'

type IParams = {
  hash: string
}

type IFormData = RegisterPatientViaRegistrationLinkData

export function RegisterPatientViaRegistrationLinkPage() {
  const navigate = useNavigate()
  const { hash } = useParams<IParams>()

  const { data: registrationLinkInfo, isError } = useRegistrationLink(hash)
  const { registerPatientViaRegistrationLink, isRegisteringPatient } =
    useRegisterPatientViaRegistrationLink(hash)

  if (isError) navigate('/sign-in')

  const form = useForm<IFormData>({
    resolver: zodResolver(
      registerPatientViaRegistrationLinkSchema,
    ) as Resolver<IFormData>,
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = form

  const handleRedirectToSignIn = () => {
    navigate('/sign-in')
  }

  const targeteHonorific = registrationLinkInfo?.psychologistHonorific
  const honorifc = targeteHonorific && translatedHonorific[targeteHonorific]

  const isDisabled = isRegisteringPatient || isDirty || !isValid

  return (
    <Card className="w-xl px-6">
      <CardHeader className="border-b px-0">
        <div className="mb-4">
          <CardTitle className="text-center text-2xl">
            Crie sua conta para iniciar seu acompanhamento
          </CardTitle>
          <CardDescription className="text-center">
            Preencha seus dados para criar sua conta. Ao finalizar, seu perfil
            será vinculado automaticamente ao profissional responsável pelo
            convite.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 rounded-md border px-4 py-2">
          <div className="flex w-fit items-center justify-center rounded-md bg-success/15 p-2">
            <UserCheck size={20} className="shrink-0 text-success" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{`${honorifc} ${registrationLinkInfo?.professionalName}`}</p>
            <div>
              <p className="text-xs text-muted-foreground">
                CRP {registrationLinkInfo?.psychologistCrp}
              </p>
              <p className="text-xs text-muted-foreground">
                Você está realizando o cadastro por convite desta profissional.
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(registerPatientViaRegistrationLink)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <TextInput<IFormData>
                name="firstName"
                label="Nome"
                placeholder="Jon"
              />
              <TextInput<IFormData>
                name="lastName"
                label="Sobrenome"
                placeholder="Doe"
              />
            </div>

            <EmailInput<IFormData>
              name="email"
              label="Email"
              placeholder="ex: exemplo@mindflush.com"
            />

            <PasswordInput<IFormData>
              name="password"
              label="Senha"
              placeholder="Crie uma senha segura"
              autoComplete="new-password"
            />

            <GenderSelectInput<IFormData> name="gender" label="Gênero" />

            <FieldSeparator>Opcional</FieldSeparator>

            <div className="grid grid-cols-2 gap-4">
              <PhoneInput<IFormData> name="phoneNumber" label="Telefone" />
              <DateInput<IFormData>
                name="dateOfBirth"
                label="Data de nascimento"
              />
            </div>

            <CpfInput<IFormData> name="cpf" label="CPF" />

            <div className="flex justify-end gap-2 px-0">
              <Button
                type="button"
                variant="outline"
                disabled={isDisabled}
                onClick={handleRedirectToSignIn}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar conta e continuar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="items-start gap-1 p-0">
        <ShieldCheck size={16} className="text-success" />
        <p className="text-[11px] text-muted-foreground">
          Seus dados serão utilizados apenas para criar sua conta e organizar
          seu acompanhamento profissional.
        </p>
      </CardFooter>
    </Card>
  )
}
