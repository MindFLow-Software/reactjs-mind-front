import { useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
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

import { GoogleAuthButton } from '../../../components/google-auth-button/google-auth-button'
import { AuthDivider } from '../../../components/auth-divider/auth-divider'
import { useSignUp } from '../../hooks/use-sign-up'
import {
  createUserSchema,
  type ICreateUserData,
} from '@/validators/user/form/create-user-schema'

import './sign-up-form.css'

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex my-2">
      <div className="h-px flex-1 bg-border" />
      <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gray-50 z-10 text-[10px] font-bold uppercase tracking-widest text-blue-600 px-1.5">
        {children}
      </span>
    </div>
  )
}

export function SignUpForm() {
  const { signUp, isSigningUp } = useSignUp()

  const methods = useForm<ICreateUserData>({
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

  const { handleSubmit, watch } = methods
  const passwordValue = watch('password')

  const handleSignUp = useCallback(
    (data: ICreateUserData) => {
      signUp(data)
    },
    [signUp],
  )

  const handleInvalidSubmit = useCallback(() => {
    toast.error('Preencha corretamente os campos destacados.')
  }, [])

  return (
    <Form {...methods}>
      <form
        className="suf-root"
        onSubmit={handleSubmit(handleSignUp, handleInvalidSubmit)}
      >
        <GoogleAuthButton />

        <div className="suf-divider">
          <AuthDivider label="ou" />
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeading>Dados Pessoais</SectionHeading>

          <div className="suf-row">
            <TextInput<ICreateUserData>
              name="firstName"
              label="Primeiro Nome"
              placeholder="Jon"
            />
            <TextInput<ICreateUserData>
              name="lastName"
              label="Último Nome"
              placeholder="Doe"
            />
          </div>

          <div className="suf-row">
            <PhoneInput<ICreateUserData> name="phoneNumber" label="Telefone" />
            <CpfInput<ICreateUserData> name="cpf" label="CPF" />
          </div>

          <DateInput<ICreateUserData>
            name="dateOfBirth"
            label="Data de Nascimento"
          />

          <GenderSelectInput<ICreateUserData> name="gender" label="Gênero" />

          <SectionHeading>Acesso</SectionHeading>

          <EmailInput<ICreateUserData>
            name="email"
            label="E-mail profissional"
            placeholder="exemplo@mindflush.com"
            autoComplete="email"
          />

          <div className="suf-password-field">
            <PasswordInput<ICreateUserData>
              name="password"
              label="Senha"
              placeholder="Crie uma senha forte"
              autoComplete="new-password"
            />
            <PasswordStrength value={passwordValue} />
          </div>

          <Button type="submit" disabled={isSigningUp} className="suf-submit">
            {isSigningUp ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Criando conta…
              </>
            ) : (
              'Criar conta'
            )}
          </Button>
        </div>

        <p className="suf-legal">
          Ao continuar você aceita os{' '}
          <Link to="#" className="suf-legal-link">
            termos
          </Link>{' '}
          e a{' '}
          <Link to="#" className="suf-legal-link">
            privacidade
          </Link>
          .{' · '}
          <Link to="/sign-in" className="suf-signin-link">
            Fazer login
          </Link>
        </p>
      </form>
    </Form>
  )
}
