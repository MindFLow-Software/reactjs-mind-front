import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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

import {
  registerPatientViaRegistrationLinkSchema,
  type IRegisterPatientViaRegistrationLinkData,
} from '@/validators/register-patient-via-registration-link/form/register-patient-via-registration-link-schema'

import { useRegisterPatientViaRegistrationLink } from '../../hooks/use-register-patient-via-registration-link'

import './register-patient-via-registration-link-form.css'

type IRegisterPatientViaRegistrationLinkForm = {
  hash: string | undefined
}

export function RegisterPatientViaRegistrationLinkForm({
  hash,
}: IRegisterPatientViaRegistrationLinkForm) {
  const navigate = useNavigate()

  const { registerPatient, isRegisteringPatient } =
    useRegisterPatientViaRegistrationLink(hash)

  const methods = useForm<IRegisterPatientViaRegistrationLinkData>({
    resolver: zodResolver(
      registerPatientViaRegistrationLinkSchema,
    ) as Resolver<IRegisterPatientViaRegistrationLinkData>,
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = methods

  const handleRegister = useCallback(
    (data: IRegisterPatientViaRegistrationLinkData) => {
      registerPatient(data)
    },
    [registerPatient],
  )

  const handleRedirectToSignIn = useCallback(() => {
    navigate('/sign-in')
  }, [navigate])

  const isCancelDisabled = isRegisteringPatient || isDirty || !isValid

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(handleRegister)} className="rprl-root">
        <div className="rprl-row">
          <TextInput<IRegisterPatientViaRegistrationLinkData>
            name="firstName"
            label="Nome"
            placeholder="Jon"
          />
          <TextInput<IRegisterPatientViaRegistrationLinkData>
            name="lastName"
            label="Sobrenome"
            placeholder="Doe"
          />
        </div>

        <EmailInput<IRegisterPatientViaRegistrationLinkData>
          name="email"
          label="Email"
          placeholder="ex: exemplo@mindflush.com"
        />

        <PasswordInput<IRegisterPatientViaRegistrationLinkData>
          name="password"
          label="Senha"
          placeholder="Crie uma senha segura"
          autoComplete="new-password"
        />

        <GenderSelectInput<IRegisterPatientViaRegistrationLinkData>
          name="gender"
          label="Gênero"
        />

        <FieldSeparator>Opcional</FieldSeparator>

        <div className="rprl-row">
          <PhoneInput<IRegisterPatientViaRegistrationLinkData>
            name="phoneNumber"
            label="Telefone"
          />
          <DateInput<IRegisterPatientViaRegistrationLinkData>
            name="dateOfBirth"
            label="Data de nascimento"
          />
        </div>

        <CpfInput<IRegisterPatientViaRegistrationLinkData>
          name="cpf"
          label="CPF"
        />

        <div className="rprl-actions">
          <Button
            type="button"
            variant="outline"
            disabled={isCancelDisabled}
            onClick={handleRedirectToSignIn}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isRegisteringPatient}>
            Criar conta e continuar
          </Button>
        </div>
      </form>
    </Form>
  )
}
