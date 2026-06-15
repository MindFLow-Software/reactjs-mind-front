import type React from 'react'
import { useForm, type Resolver } from 'react-hook-form'
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
import { AxiosError } from 'axios'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createUser } from '@/api/auth/create-user'
import { signIn } from '@/api/auth/sign-in'
import { createPatientProfile } from '@/api/auth/create-patient-profile'
import { getInviteDetails } from '@/api/invites/get-invite-details'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import {
  patientSignUpSchema,
  type PatientSignUpSchema,
} from '@/validators/auth'
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
    register,
    handleSubmit,
    setValue,
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
      await createPatientProfile({ psychologistPracticeContextId })
    },
  })

  const handleSignUp = useCallback(
    async (data: PatientSignUpSchema) => {
      try {
        await registerPatient(data)
        clearActivePracticeContextId()
        toast.success('Cadastro realizado!')
        navigate('/patient-dashboard')
      } catch (error: unknown) {
        const message =
          error instanceof AxiosError ? error.message : 'Erro ao criar conta.'
        toast.error(message)
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
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="firstName"
              className="pl-10"
              {...register('firstName')}
            />
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input id="lastName" {...register('lastName')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            id="email"
            type="email"
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Criar Senha</Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="pl-10 pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">WhatsApp/Celular</Label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="phoneNumber"
              className="pl-10"
              {...register('phoneNumber')}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <div className="relative">
            <Fingerprint
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input id="cpf" className="pl-10" {...register('cpf')} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Nascimento</Label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              id="dateOfBirth"
              type="date"
              className="pl-10"
              {...register('dateOfBirth')}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Gênero</Label>
          <Select onValueChange={(value: Gender) => setValue('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Gender.MASCULINE}>Masculino</SelectItem>
              <SelectItem value={Gender.FEMININE}>Feminino</SelectItem>
              <SelectItem value={Gender.OTHER}>Outro</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-red-500 text-xs">{errors.gender.message}</p>
          )}
        </div>
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
