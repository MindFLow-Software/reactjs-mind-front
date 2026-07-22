import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { CardContent, CardFooter } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { EmailInput } from '@/components/form-fields/email-input/email-input'
import { PasswordInput } from '@/components/form-fields/password-input/password-input'
import { CpfInput } from '@/components/form-fields/cpf-input/cpf-input'
import { PasswordStrength } from '@/components/password-strength/password-strength'

import {
  registerViaPatientInviteSchema,
  type IRegisterViaPatientInviteData,
} from '@/validators/register-via-patient-invite/form/register-via-patient-invite-schema'

import { useRegisterViaPatientInvite } from '../../hooks/use-register-via-patient-invite'

import './register-via-patient-invite-form.css'

type IRegisterViaPatientInviteForm = {
  token: string | undefined
}

export function RegisterViaPatientInviteForm({
  token,
}: IRegisterViaPatientInviteForm) {
  const { registerPatientAccount, isRegistering } =
    useRegisterViaPatientInvite(token)

  const methods = useForm<IRegisterViaPatientInviteData>({
    resolver: zodResolver(registerViaPatientInviteSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const { handleSubmit, watch } = methods
  const passwordValue = watch('password')

  const handleRegister = useCallback(
    (data: IRegisterViaPatientInviteData) => {
      registerPatientAccount(data)
    },
    [registerPatientAccount],
  )

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(handleRegister)}>
        <CardContent className="rvpi-content">
          <div className="rvpi-row">
            <TextInput<IRegisterViaPatientInviteData>
              name="firstName"
              label="Primeiro Nome"
              placeholder="Jon"
            />
            <TextInput<IRegisterViaPatientInviteData>
              name="lastName"
              label="Último Nome"
              placeholder="Doe"
            />
          </div>

          <CpfInput<IRegisterViaPatientInviteData> name="cpf" label="CPF" />

          <EmailInput<IRegisterViaPatientInviteData>
            name="email"
            label="Email"
            placeholder="exemplo@mindflush.com"
          />

          <div className="rvpi-password-field">
            <PasswordInput<IRegisterViaPatientInviteData>
              name="password"
              label="Senha"
              placeholder="Crie uma senha forte"
              autoComplete="new-password"
            />
            <PasswordStrength value={passwordValue} />
          </div>
        </CardContent>
        <CardFooter className="rvpi-footer">
          <Button type="submit" disabled={isRegistering}>
            Cadastrar
          </Button>
        </CardFooter>
      </form>
    </Form>
  )
}
