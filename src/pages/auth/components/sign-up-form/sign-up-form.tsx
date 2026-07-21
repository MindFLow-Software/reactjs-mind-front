import { useCallback } from 'react'
import { Loader2 } from 'lucide-react'

import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'
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
import { PasswordStrength } from '@/components/password-strength/password-strength'
import { GoogleAuthButton } from '../google-auth-button/google-auth-button'

import { Time } from '@/utils/time'
import { signIn } from '@/api/auth/sign-in'
import { Normalizer } from '@/utils/normalizer'
import { createUser } from '@/api/auth/create-user'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import {
  createUserSchema,
  type CreateUserData,
} from '@/validators/user/form/create-user-schema'

export function SignUpForm() {
  const navigate = useNavigate()

  const methods = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      cpf: undefined,
    },
  })

  const { handleSubmit } = methods
  const passwordValue = methods.watch('password')

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: CreateUserData) => {
      await createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        gender: data.gender,
        phoneNumber: Normalizer.digits(data.phoneNumber),
        cpf: Normalizer.digits(data.cpf),
        dateOfBirth: Time.toAmericanFormat(data.dateOfBirth),
      })
    },
    onSuccess: async (_, { email, password }) => {
      await signIn({ email, password })
      toast.success('Conta criada com sucesso!')
      navigate('/profiles')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao realizar cadastro.'))
    },
  })

  const handleSignUp = useCallback(
    async (data: CreateUserData) => {
      await mutateAsync(data)
    },
    [mutateAsync],
  )

  const onInvalid = () =>
    toast.error('Preencha corretamente os campos destacados.')

  return (
    <Form {...methods}>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleSignUp, onInvalid)}
      >
        <GoogleAuthButton />

        <div className="relative inset-0 my-2 flex items-center">
          <span className="w-full border-t" />
          <p className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
            OU
          </p>
        </div>

        <FieldSeparator>Dados Pessoais</FieldSeparator>

        <div className="grid grid-cols-2 gap-3">
          <TextInput<CreateUserData>
            name="firstName"
            label="Primeiro Nome"
            placeholder="Jon"
            autoComplete="given-name"
          />
          <TextInput<CreateUserData>
            name="lastName"
            label="Último Nome"
            placeholder="Doe"
            autoComplete="family-name"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PhoneInput<CreateUserData> name="phoneNumber" label="Telefone" />
          <CpfInput<CreateUserData> name="cpf" label="CPF" />
        </div>

        <DateInput<CreateUserData>
          name="dateOfBirth"
          label="Data de Nascimento"
        />

        <GenderSelectInput<CreateUserData> name="gender" label="Gênero" />

        <FieldSeparator>Acesso</FieldSeparator>

        <EmailInput<CreateUserData>
          name="email"
          label="E-mail profissional"
          placeholder="exemplo@mindflush.com"
          autoComplete="email"
        />

        <div className="flex flex-col gap-1">
          <PasswordInput<CreateUserData>
            name="password"
            label="Senha"
            placeholder="Crie uma senha forte"
            autoComplete="new-password"
          />
          <PasswordStrength value={passwordValue} />
        </div>

        <Button type="submit" disabled={isPending} className="mt-1 w-full">
          {isPending ? (
            <>
              <Loader2 data-icon="inline-start" className="animate-spin" />
              Criando conta…
            </>
          ) : (
            'Criar conta'
          )}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Ao continuar você aceita os{' '}
          <Link
            to="#"
            className="underline underline-offset-4 hover:text-foreground"
          >
            termos
          </Link>{' '}
          e a{' '}
          <Link
            to="#"
            className="underline underline-offset-4 hover:text-foreground"
          >
            privacidade
          </Link>
          .{' · '}
          <Link
            to="/sign-in"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </form>
    </Form>
  )
}
