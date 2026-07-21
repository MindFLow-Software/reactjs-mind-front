import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { EmailInput } from '@/components/form-fields/email-input/email-input'
import { PasswordInput } from '@/components/form-fields/password-input/password-input'
import { CpfInput } from '@/components/form-fields/cpf-input/cpf-input'
import { PasswordStrength } from '@/components/password-strength/password-strength'

import {
  registerViaPatientInviteSchema,
  type RegisterViaPatientInviteData,
} from '@/validators/register-via-patient-invite/form/register-via-patient-invite-schema'

import { useRegisterViaPatientInvite } from './hooks/use-register-via-patient-invite'

import './register-via-patient-invite-page.css'

type Iparams = {
  token: string
}

type IFormData = RegisterViaPatientInviteData

export function RegisterViaPatientInvitePage() {
  const { token } = useParams<Iparams>()

  const methods = useForm<IFormData>({
    resolver: zodResolver(registerViaPatientInviteSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const { handleSubmit } = methods
  const passwordValue = methods.watch('password')

  const { registerPatientAccount, isRegistering } =
    useRegisterViaPatientInvite(token)

  return (
    <Card className="inv-register-card">
      <CardHeader>
        <CardTitle>Finalizar Cadastro</CardTitle>
        <CardDescription>
          Precisamos de algumas informações para criar sua conta e confirmar com
          segurança o vínculo com seu psicólogo.
        </CardDescription>
      </CardHeader>
      <Form {...methods}>
        <form onSubmit={handleSubmit(registerPatientAccount)}>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <TextInput<IFormData>
                name="firstName"
                label="Primeiro Nome"
                placeholder="Jon"
              />
              <TextInput<IFormData>
                name="lastName"
                label="Último Nome"
                placeholder="Doe"
              />
            </div>

            <CpfInput<IFormData> name="cpf" label="CPF" />

            <EmailInput<IFormData>
              name="email"
              label="Email"
              placeholder="exemplo@mindflush.com"
            />

            <div className="flex flex-col gap-1">
              <PasswordInput<IFormData>
                name="password"
                label="Senha"
                placeholder="Crie uma senha forte"
                autoComplete="new-password"
              />
              <PasswordStrength value={passwordValue} />
            </div>
          </CardContent>
          <CardFooter className="inv-register-footer">
            <Button type="submit" disabled={isRegistering}>
              Cadastrar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
