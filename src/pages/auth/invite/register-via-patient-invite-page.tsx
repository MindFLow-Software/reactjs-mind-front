import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MaskedInput } from '@/components/maked-input'
import { PasswordStrength } from '@/components/password-strength'

import {
  registerViaPatientInviteSchema,
  type RegisterViaPatientInviteData,
} from '@/validators/register-via-patient-invite/form/register-via-patient-invite-schema'

import { useRegisterViaPatientInvite } from './hooks/use-register-via-patient-invite'

import './register-via-patient-invite-page.css'

type Iparams = {
  token: string
}

export function RegisterViaPatientInvitePage() {
  const { token } = useParams<Iparams>()

  const [showPassword, setShowPassword] = useState(false)

  const methods = useForm<RegisterViaPatientInviteData>({
    resolver: zodResolver(registerViaPatientInviteSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = methods

  const passwordValue = watch('password')

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((passwordShown) => !passwordShown),
    [],
  )

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
          <CardContent>
            <FieldSet className="gap-4">
              <FieldGroup className="flex flex-row items-start gap-4">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel htmlFor="firstName">Primeiro Nome</FieldLabel>
                      <Input
                        {...field}
                        id="firstName"
                        placeholder="Jon"
                        aria-invalid={!!errors.firstName}
                        className={cn(errors.firstName && 'border-red-500')}
                      />
                      {errors?.firstName && (
                        <FieldError>{errors?.firstName?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel htmlFor="lastName">Último Nome</FieldLabel>
                      <Input
                        {...field}
                        id="lastName"
                        placeholder="Doe"
                        aria-invalid={!!errors.lastName}
                        className={cn(errors.lastName && 'border-red-500')}
                      />
                      {errors?.lastName && (
                        <FieldError>{errors?.lastName?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <FieldGroup>
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                      <MaskedInput
                        {...field}
                        id="cpf"
                        mask="000.000.000-00"
                        placeholder="123.456.789-00"
                        aria-invalid={!!errors.cpf}
                        className={cn(errors.cpf && 'border-red-500')}
                      />
                      {errors?.cpf && (
                        <FieldError>{errors?.cpf?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <FieldGroup className="gap-4">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder="exemplo@mindflush.com"
                        spellCheck={false}
                        aria-invalid={!!errors.email}
                        className={cn(errors.email && 'border-red-500')}
                      />
                      {errors?.email && (
                        <FieldError>{errors?.email?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel htmlFor="password">Senha</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Crie uma senha forte"
                          autoComplete="new-password"
                          aria-invalid={!!errors.password}
                          className={cn(
                            'pr-9',
                            errors.password && 'border-red-500',
                          )}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="inv-password-toggle"
                          aria-label={
                            showPassword ? 'Ocultar senha' : 'Mostrar senha'
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                      {errors?.password && (
                        <FieldError>{errors?.password?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <PasswordStrength value={passwordValue} />
            </FieldSet>
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
