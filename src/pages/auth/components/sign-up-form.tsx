import { useCallback, useState } from 'react'

import {
  Eye,
  Mars,
  Users,
  Venus,
  EyeOff,
  Loader2,
  CalendarIcon,
} from 'lucide-react'

import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroup,
} from '@/components/ui/select'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { MaskedInput } from '@/components/maked-input'
import { GoogleAuthButton } from './google-auth-button'
import { PasswordStrength } from '@/components/password-strength'

import { Time } from '@/utils/time'
import { signIn } from '@/api/auth/sign-in'
import { Normalizer } from '@/utils/normalizer'
import { createUser } from '@/api/auth/create-user'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
// import { useSessionStore } from '@/store/use-session-store'
import {
  createUserSchema,
  type CreateUserData,
} from '@/validators/user/form/create-user-schema'

function FieldRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <FieldGroup className={cn('grid grid-cols-2 gap-3', className)}>
      {children}
    </FieldGroup>
  )
}

function FieldWrap({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Field className={cn('flex flex-col gap-1', className)}>
      <FieldLabel
        className={cn(
          'text-xs font-medium text-foreground/70',
          error && 'text-red-500',
        )}
      >
        {label}
      </FieldLabel>
      {children}
      {error && (
        <FieldError className="text-[10px] font-medium">{error}</FieldError>
      )}
    </Field>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 px-1">
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

export function SignUpForm() {
  const navigate = useNavigate()
  // const setSession = useSessionStore((state) => state.setSession)

  const [dobInputValue, setDobInputValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      cpf: '',
    },
  })

  const passwordValue = watch('password')

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
      // setSession(profile)
      await signIn({ email, password })
      toast.success('Conta criada com sucesso!')
      navigate('/profiles')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao realizar cadastro.'))
    },
  })

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((p) => !p),
    [],
  )

  const handleSignUp = useCallback(
    async (data: CreateUserData) => {
      await mutateAsync(data)
    },
    [mutateAsync],
  )

  const onInvalid = () =>
    toast.error('Preencha corretamente os campos destacados.')

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={handleSubmit(handleSignUp, onInvalid)}
    >
      {/* Google */}
      <GoogleAuthButton />

      {/* OR divider */}
      <div className="relative inset-0 flex items-center my-2">
        <span className="w-full border-t" />
        <p className="absolute left-1/2 -translate-x-1/2 bg-gray-50 px-2 text-xs text-muted-foreground">
          OU
        </p>
      </div>

      {/* ── Dados Pessoais ── */}
      <SectionHeading>Dados Pessoais</SectionHeading>

      <FieldRow>
        <FieldWrap label="Primeiro Nome" error={errors.firstName?.message}>
          <Input
            {...register('firstName')}
            placeholder="Jon"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            className={cn(errors.firstName && 'border-red-500')}
          />
        </FieldWrap>
        <FieldWrap label="Último Nome" error={errors.lastName?.message}>
          <Input
            {...register('lastName')}
            placeholder="Doe"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            className={cn(errors.lastName && 'border-red-500')}
          />
        </FieldWrap>
      </FieldRow>

      <FieldRow>
        <FieldWrap label="Telefone" error={errors.phoneNumber?.message}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <MaskedInput
                name={field.name}
                value={field.value}
                inputRef={field.ref}
                mask="(00) 00000-0000"
                placeholder="(99) 99999-9999"
                type="tel"
                autoComplete="tel"
                onAccept={(value: string) => field.onChange(value)}
                onBlur={field.onBlur}
                className={cn(
                  'tabular-nums',
                  errors.phoneNumber && 'border-red-500',
                )}
              />
            )}
          />
        </FieldWrap>
        <FieldWrap label="CPF" error={errors.cpf?.message}>
          <Controller
            control={control}
            name="cpf"
            render={({ field }) => (
              <MaskedInput
                name={field.name}
                value={field.value}
                inputRef={field.ref}
                mask="000.000.000-00"
                placeholder="123.456.789-00"
                autoComplete="off"
                onAccept={(value: string) => field.onChange(value)}
                onBlur={field.onBlur}
                className={cn('tabular-nums', errors.cpf && 'border-red-500')}
              />
            )}
          />
        </FieldWrap>
      </FieldRow>

      <FieldRow>
        <FieldWrap
          label="Data de Nascimento"
          error={errors.dateOfBirth?.message}
        >
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <Popover>
                <div className="relative">
                  <Input
                    placeholder="DD/MM/AAAA"
                    value={dobInputValue}
                    onChange={(e) => {
                      const { date, inputValue } = Time.textToDate(
                        e.target.value,
                      )
                      setDobInputValue(inputValue)
                      field.onChange(date)
                    }}
                    maxLength={10}
                    autoComplete="bday"
                    aria-invalid={!!errors.dateOfBirth}
                    className={cn(
                      'pr-9 tabular-nums',
                      errors.dateOfBirth && 'border-red-500',
                    )}
                  />
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="
                          absolute right-0 top-0 h-full px-2.5
                          text-muted-foreground hover:text-blue-600 cursor-pointer flex
                          items-center outline-none rounded-r-md transition-colors
                        "
                    >
                      <CalendarIcon className="size-3.5" />
                    </button>
                  </PopoverTrigger>
                </div>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                  sideOffset={6}
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    captionLayout="dropdown"
                    startMonth={Time.minDate}
                    onSelect={(date) => {
                      field.onChange(date)
                      setDobInputValue(Time.dateToText(date))
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </FieldWrap>

        <FieldWrap label="Gênero" error={errors.gender?.message}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="FEMININE" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Venus className="size-3.5 text-rose-500" /> Feminino
                      </div>
                    </SelectItem>
                    <SelectItem value="MASCULINE" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Mars className="size-3.5 text-blue-500" /> Masculino
                      </div>
                    </SelectItem>
                    <SelectItem value="OTHER" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Users className="size-3.5 text-violet-500" /> Outro
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </FieldWrap>
      </FieldRow>

      {/* ── Acesso ── */}
      <SectionHeading>Acesso</SectionHeading>

      <FieldWrap label="E-mail profissional" error={errors.email?.message}>
        <Input
          type="email"
          {...register('email')}
          placeholder="exemplo@mindflush.com"
          autoComplete="email"
          spellCheck={false}
          aria-invalid={!!errors.email}
          className={cn(errors.email && 'border-red-500')}
        />
      </FieldWrap>

      <FieldWrap label="Senha" error={errors.password?.message}>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="Crie uma senha forte"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            className={cn('pr-9', errors.password && 'border-red-500')}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="
              absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground
              hover:text-foreground cursor-pointer transition-colors outline-none rounded-sm
            "
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <PasswordStrength value={passwordValue} />
      </FieldWrap>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="
          w-full mt-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
          transition-all duration-200 font-medium text-white cursor-pointer
        "
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" /> Criando conta…
          </>
        ) : (
          'Criar conta'
        )}
      </Button>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground leading-relaxed">
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
          className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
        >
          Fazer login
        </Link>
      </p>
    </form>
  )
}
