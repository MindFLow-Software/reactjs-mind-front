import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import { registerViaPatientInvite } from '@/api/patient-profiles/register-via-patient-invite'

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
  type IregisterViaPatientInvite,
} from '@/validators/register-via-patient-invite'
import { signIn } from '@/api/auth/sign-in'

type Iparams = {
  token: string
}

export function RegisterViaPatientInvitePage() {
  const navigate = useNavigate()
  const { token } = useParams<Iparams>()

  const [showPassword, setShowPassword] = useState(false)

  const methods = useForm<IregisterViaPatientInvite>({
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

  const { mutateAsync, isPending: isRegistering } = useMutation({
    mutationKey: ['register-via-patient-invite', token],
    mutationFn: async (data: IregisterViaPatientInvite) => {
      await registerViaPatientInvite(token, data)
    },
    onSuccess: async (_, { email, password }) => {
      toast.success('Conta criada com sucesso.')
      await signIn({
        email,
        password,
      })
      navigate(`/patient/invite/${token}/review`)
    },
    onError: () => {
      toast.error('Erro ao criar conta.')
    },
  })

  const onRegisterViaPatientInvite = async (
    data: IregisterViaPatientInvite,
  ) => {
    await mutateAsync(data)
  }

  const isDisabled = isRegistering

  return (
    <Card className="w-xl gap-2">
      <CardHeader>
        <CardTitle>Finalizar Cadastro</CardTitle>
        <CardDescription>
          Precisamos de algumas informações para criar sua conta e confirmar com
          segurança o vínculo com seu psicólogo.
        </CardDescription>
      </CardHeader>
      <Form {...methods}>
        <form onSubmit={handleSubmit(onRegisterViaPatientInvite)}>
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
                          className="
                            absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground
                            hover:text-foreground cursor-pointer transition-colors outline-none rounded-sm
                          "
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
          <CardFooter className="flex justify-end mt-4">
            <Button type="submit" disabled={isDisabled}>
              Cadastrar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
