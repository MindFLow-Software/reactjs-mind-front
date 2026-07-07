import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import {
  Eye,
  Mars,
  Venus,
  Users,
  EyeOff,
  UserCheck,
  ShieldCheck,
  CalendarIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'

import { Time } from '@/utils/time'
import { useRegistrationLink } from '@/hooks/use-registration-link'
import { translatedHonorific } from '@/constants/translated-honorific'
import { useRegisterPatientViaRegistrationLink } from './hooks/use-register-patient-via-registration-link'

import {
  registerPatientViaRegistrationLinkSchema,
  type RegisterPatientViaRegistrationLinkData,
} from '@/validators/register-patient-via-registration-link/form/register-patient-via-registration-link-schema'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import {
  Field,
  FieldSet,
  FieldError,
  FieldLabel,
  FieldGroup,
} from '@/components/ui/field'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { MaskedInput } from '@/components/maked-input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type IParams = {
  hash: string
}

export function RegisterPatientViaRegistrationLinkPage() {
  const navigate = useNavigate()
  const { hash } = useParams<IParams>()

  const [dobInputValue, setDobInputValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { data: registrationLinkInfo, isError } = useRegistrationLink(hash)
  const { registerPatientViaRegistrationLink, isRegisteringPatient } = useRegisterPatientViaRegistrationLink(hash)

  if (isError) navigate('/sign-in')

  const form = useForm<RegisterPatientViaRegistrationLinkData>({
    resolver: zodResolver(registerPatientViaRegistrationLinkSchema) as Resolver<RegisterPatientViaRegistrationLinkData>,
    defaultValues: {
      firstName: '',
      lastName: '',
    }
  })

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isDirty,
      isValid
    },
  } = form

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((p) => !p),
    [],
  )

  const handleRedirectToSignIn = () => {
    navigate('/sign-in')
  }

  const targeteHonorific = registrationLinkInfo?.psychologistHonorific
  const honorifc = targeteHonorific && translatedHonorific[targeteHonorific]

  const isDisabled = isRegisteringPatient || isDirty || !isValid

  return (
    <Card className="w-xl px-6">
      <CardHeader className="border-b px-0">
        <div className="mb-4">
          <CardTitle className="text-2xl text-center">
            Crie sua conta para iniciar seu acompanhamento
          </CardTitle>
          <CardDescription className="text-center">
            Preencha seus dados para criar sua conta. Ao finalizar,
            seu perfil será vinculado automaticamente ao profissional responsável pelo convite.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 border rounded-md py-2 px-4">
          <div className="flex items-center justify-center p-2 bg-green-200 w-fit rounded-md">
            <UserCheck size={20} className="text-green-500 shrink-0" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{`${honorifc} ${registrationLinkInfo?.professionalName}`}</p>
            <div>
              <p className="text-xs text-muted-foreground">CRP {registrationLinkInfo?.psychologistCrp}</p>
              <p className="text-xs text-muted-foreground">
                Você está realizando o cadastro por convite desta profissional.
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(registerPatientViaRegistrationLink)}
            className="flex flex-col gap-4"
          >
            <FieldSet>
              <FieldGroup className="flex flex-row items-start gap-4">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-xs font-medium text-foreground/70">Nome</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Jon"
                        className={cn(errors.firstName && 'border-red-500')}
                      />
                      <FieldError>{errors.firstName?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-xs font-medium text-foreground/70">Sobrenome</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Doe"
                        className={cn(errors.lastName && 'border-red-500')}
                      />
                      <FieldError>{errors.lastName?.message}</FieldError>
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
                      <FieldLabel className="text-xs font-medium text-foreground/70">Email</FieldLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder="ex: exemplo@mindflush.com"
                        className={cn(errors.email && 'border-red-500')}
                      />
                      <FieldError>{errors.email?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-xs font-medium text-foreground/70">Senha</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Crie uma senha segura"
                          className={cn(errors.password && 'border-red-500')}
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
                      <FieldError>{errors.password?.message}</FieldError>
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-xs font-medium text-foreground/70">Gênero</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Selecione uma opção" />
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
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="relative mt-1">
                <p className="absolute left-1/2 -translate-x-1/2 -top-1.5 bg-white text-[10px] font-bold uppercase tracking-widest text-blue-600 px-1">
                  Opcional
                </p>
                <Separator />
              </div>

              <FieldGroup className="flex flex-row items-start gap-4">
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-xs font-medium text-foreground/70">Telefone</FieldLabel>
                      <MaskedInput
                        {...field}
                        type="text"
                        value={field.value}
                        inputRef={field.ref}
                        mask="(00) 00000-0000"
                        placeholder="(00) 00000-0000"
                        onAccept={(value: string) => field.onChange(value)}
                        className={cn(errors.phoneNumber && 'border-red-500')}
                      />
                      <FieldError>{errors.phoneNumber?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <Field className="gap-1">
                        <FieldLabel className="text-xs font-medium text-foreground/70">Data de nascimento</FieldLabel>
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
                      </Field>
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
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-xs font-medium text-foreground/70">CPF</FieldLabel>
                      <MaskedInput
                        value={field.value}
                        inputRef={field.ref}
                        autoComplete="off"
                        mask="000.000.000-00"
                        placeholder="123.456.789-00"
                        onAccept={(value: string) => field.onChange(value)}
                        className={cn(errors.cpf && 'border-red-500')}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <div className="flex gap-2 justify-end px-0">
              <Button
                type="button"
                variant="outline"
                disabled={isDisabled}
                onClick={handleRedirectToSignIn}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar conta e continuar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="items-start gap-1 p-0">
        <ShieldCheck size={16} className="text-green-500" />
        <p className="text-[11px] text-muted-foreground">
          Seus dados serão utilizados apenas para criar sua conta e organizar seu acompanhamento profissional.
        </p>
      </CardFooter>
    </Card>
  )
}
