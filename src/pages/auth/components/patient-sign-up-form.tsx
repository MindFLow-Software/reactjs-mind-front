import type React from 'react'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Fingerprint,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useState, useCallback } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { createUser } from '@/api/auth/create-user'
import { signIn } from '@/api/auth/sign-in'
import { createOwnPatientProfile } from '@/api/patient-profiles/create-own-patient-profile'
import { getInviteDetails } from '@/api/invites/get-invite-details'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import {
  patientSignUpSchema,
  type PatientSignUpSchema,
} from '@/validators/auth/form/patient-sign-up-schema'
import { Gender } from '@/types/patient'

function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function PatientSignUpForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const navigate = useNavigate()
  const { hash } = useParams<{ hash: string }>()
  const clearActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.clearActivePracticeContextId,
  )
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<PatientSignUpSchema>({
    resolver: zodResolver(patientSignUpSchema) as Resolver<PatientSignUpSchema>,
  })

  const { mutateAsync: registerPatient } = useMutation({
    mutationFn: async (data: PatientSignUpSchema) => {
      if (!hash) throw new Error('Convite inválido ou ausente.')

      await createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        gender: data.gender,
        phoneNumber: data.phoneNumber?.replace(/\D/g, '') || undefined,
        cpf: data.cpf?.replace(/\D/g, '') || undefined,
        dateOfBirth: data.dateOfBirth ? toISODate(data.dateOfBirth) : undefined,
      })
      await signIn({ email: data.email, password: data.password })

      const { psychologistPracticeContextId } = await getInviteDetails(hash)
      await createOwnPatientProfile({ psychologistPracticeContextId })
    },
  })

  const handleSignUp = useCallback(
    async (data: PatientSignUpSchema) => {
      try {
        await registerPatient(data)
        clearActivePracticeContextId()
        toast.success('Cadastro realizado!')
        navigate('/patient-dashboard')
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao criar conta.'))
      }
    },
    [registerPatient, clearActivePracticeContextId, navigate],
  )

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((p) => !p),
    [],
  )

  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="firstName">Nome</FieldLabel>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="firstName"
              className="pl-10"
              aria-invalid={!!errors.firstName}
              {...register('firstName')}
            />
          </div>
          {errors.firstName && (
            <FieldError>{errors.firstName.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Sobrenome</FieldLabel>
          <Input
            id="lastName"
            aria-invalid={!!errors.lastName}
            {...register('lastName')}
          />
          {errors.lastName && (
            <FieldError>{errors.lastName.message}</FieldError>
          )}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            id="email"
            type="email"
            className="pl-10"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Criar Senha</FieldLabel>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="pl-10 pr-10"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="phoneNumber">WhatsApp/Celular</FieldLabel>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="phoneNumber"
              className="pl-10"
              aria-invalid={!!errors.phoneNumber}
              {...register('phoneNumber')}
            />
          </div>
          {errors.phoneNumber && (
            <FieldError>{errors.phoneNumber.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="cpf">CPF</FieldLabel>
          <div className="relative">
            <Fingerprint
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="cpf"
              className="pl-10"
              aria-invalid={!!errors.cpf}
              {...register('cpf')}
            />
          </div>
          {errors.cpf && <FieldError>{errors.cpf.message}</FieldError>}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="dateOfBirth">Nascimento</FieldLabel>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="dateOfBirth"
              type="date"
              className="pl-10"
              aria-invalid={!!errors.dateOfBirth}
              {...register('dateOfBirth')}
            />
          </div>
          {errors.dateOfBirth && (
            <FieldError>{errors.dateOfBirth.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="gender">Gênero</FieldLabel>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Gender.MASCULINE}>Masculino</SelectItem>
                    <SelectItem value={Gender.FEMININE}>Feminino</SelectItem>
                    <SelectItem value={Gender.OTHER}>Outro</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && <FieldError>{errors.gender.message}</FieldError>}
        </Field>
      </div>

      <Button
        disabled={isSubmitting}
        type="submit"
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 mt-2 cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          'Finalizar Cadastro'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-2">
        Já tem uma conta?{' '}
        <Link
          to="/sign-in"
          className="text-blue-600 font-semibold hover:underline"
        >
          Fazer Login
        </Link>
      </p>
    </form>
  )
}
