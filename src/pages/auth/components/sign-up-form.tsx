"use client"

import { useCallback, useState, useEffect, type ChangeEvent } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff, CalendarIcon, Loader2, CheckCircle2, Circle, Mars, Users, Venus } from "lucide-react"
import { IMaskMixin } from "react-imask"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { registerPsychologist } from "@/api/create-user"
import { env } from "@/env"

// Utilitários de data para validação
const today = new Date()
const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
const maxDateForPro = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "")
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) return false
  let sum = 0
  let remainder
  for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false
  sum = 0
  for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false
  return true
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/

export const signUpFormSchema = z.object({
  firstName: z.string().min(1, "Obrigatório"),
  lastName: z.string().min(1, "Obrigatório"),
  phoneNumber: z.string().min(1, "Obrigatório").max(15),
  email: z.string().email("Email inválido").min(1, "Obrigatório"),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .max(30, "Máximo 30 caracteres")
    .regex(passwordRegex, "Senha muito fraca"),
  dateOfBirth: z.date({
    message: "Obrigatório",
  })
    // 🟢 Validação de Limite Superior (120 anos)
    .refine((date) => date >= minDate, {
      message: "Data de nascimento inválida. Verifique o ano.",
    })
    // 🟢 Validação de Limite Inferior (18 anos para Profissionais)
    .refine((date) => date <= maxDateForPro, {
      message: "É necessário ser maior de 18 anos para criar uma conta profissional.",
    }),
  cpf: z.string()
    .min(11, "CPF incompleto")
    .refine((value) => isValidCPF(value), "CPF inválido"),
  gender: z.enum(["MASCULINE", "FEMININE", "OTHER"], {
    message: "Obrigatório",
  }),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
  <Input ref={inputRef} {...props} />
))

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      password: ""
    }
  })

  const passwordValue = watch("password", "")

  const passwordChecks = [
    { label: "8 a 30 caracteres", met: passwordValue.length >= 8 && passwordValue.length <= 30 },
    { label: "Uma letra maiúscula", met: /[A-Z]/.test(passwordValue) },
    { label: "Uma letra minúscula", met: /[a-z]/.test(passwordValue) },
    { label: "Um número", met: /\d/.test(passwordValue) },
    { label: "Um caractere especial (!@#$%^&*)", met: /[!@#$%^&*]/.test(passwordValue) },
  ]

  const { mutateAsync: registerPsychologistFn } = useMutation({
    mutationFn: registerPsychologist,
  })

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  async function handleSignUp(data: SignUpFormData) {
    try {
      await registerPsychologistFn({
        ...data,
        phoneNumber: data.phoneNumber.replace(/\D/g, ""),
        cpf: data.cpf.replace(/\D/g, ""),
        role: "PSYCHOLOGIST",
      })

      toast.success("Psicólogo cadastrado com sucesso!")
      navigate("/sign-in")
    } catch (err: any) {
      const response = err.response
      const status = response?.status
      const responseData = response?.data

      const message = Array.isArray(responseData?.message)
        ? responseData.message[0]
        : responseData?.message

      if (status === 409) {
        if (message === 'EMAIL_ALREADY_EXISTS') {
          setError("email", { type: "manual", message: "E-mail já cadastrado" })
          toast.error("E-mail já cadastrado")
          return
        }

        if (message === 'CPF_ALREADY_EXISTS') {
          setError("cpf", { type: "manual", message: "CPF já cadastrado" })
          toast.error("CPF já cadastrado")
          return
        }
      }

      toast.error("Erro ao realizar cadastro")
    }
  }

  const onInvalid = () => {
    toast.error("Preencha corretamente os campos destacados.")
  }

  return (
    <form
      onSubmit={handleSubmit(handleSignUp, onInvalid)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup className="flex flex-col gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 gap-2 font-medium"
          onClick={() => { window.location.href = `${env.VITE_API_URL}/auth/google` }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Cadastrar com Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou preencha seus dados</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName" className={cn(errors.firstName && "text-red-500")}>Primeiro Nome</FieldLabel>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Jon…"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName" className={cn(errors.lastName && "text-red-500")}>Último Nome</FieldLabel>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Doe…"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              className={cn(errors.lastName && "border-red-500 focus-visible:ring-red-500")}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email" className={cn(errors.email && "text-red-500")}>E-mail profissional</FieldLabel>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="exemplo@mindflush.com…"
            autoComplete="email"
            spellCheck={false}
            aria-invalid={!!errors.email}
            className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
          />
        </Field>

        <Field className="relative">
          <FieldLabel htmlFor="password" className={cn(errors.password && "text-red-500")}>Senha</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Crie uma senha forte…"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className={cn("pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 outline-none rounded-sm"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* ... (password checks permanecem iguais) */}
          <div className="mt-3 space-y-1.5 px-1">
            {passwordChecks.map((check, i) => (
              <div key={i} className="flex items-center gap-2 transition-opacity">
                {check.met ? (
                  <CheckCircle2 className="size-3 text-emerald-500" aria-hidden="true" />
                ) : (
                  <Circle className="size-3 text-muted-foreground/30" aria-hidden="true" />
                )}
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-tight transition-colors tabular-nums",
                  check.met ? "text-emerald-600" : "text-muted-foreground/60"
                )}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </Field>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="phoneNumber" className={cn(errors.phoneNumber && "text-red-500")}>Telefone</FieldLabel>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { ref, ...fieldProps } }) => (
                <MaskedInput
                  {...fieldProps}
                  inputRef={ref}
                  mask="(00) 00000-0000"
                  placeholder="(99) 99999-9999"
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  className={cn("tabular-nums", errors.phoneNumber && "border-red-500 focus-visible:ring-red-500")}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="cpf" className={cn(errors.cpf && "text-red-500")}>CPF</FieldLabel>
            <Controller
              control={control}
              name="cpf"
              render={({ field: { ref, ...fieldProps } }) => (
                <MaskedInput
                  {...fieldProps}
                  inputRef={ref}
                  mask="000.000.000-00"
                  placeholder="123.456.789-00"
                  id="cpf"
                  autoComplete="off"
                  className={cn("tabular-nums", errors.cpf && "border-red-500 focus-visible:ring-red-500")}
                />
              )}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="dateOfBirth" className={cn(errors.dateOfBirth && "text-red-500")}>Data de Nascimento</FieldLabel>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => {
              const [inputValue, setInputValue] = useState(
                field.value ? field.value.toLocaleDateString("pt-BR") : ""
              )

              useEffect(() => {
                if (field.value instanceof Date && !isNaN(field.value.getTime())) {
                  setInputValue(field.value.toLocaleDateString("pt-BR"))
                }
              }, [field.value])

              const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
                let val = e.target.value.replace(/\D/g, "")
                if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2)
                if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9)
                setInputValue(val)

                if (val.length === 10) {
                  const [day, month, year] = val.split("/").map(Number)
                  const date = new Date(year, month - 1, day)
                  // 🟢 Verificação manual de limite no input digitado
                  if (!isNaN(date.getTime()) && date.getFullYear() === year && year >= minDate.getFullYear()) {
                    field.onChange(date)
                  }
                }
              }

              return (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <div className="relative w-full">
                    <Input
                      id="dateOfBirth"
                      placeholder="DD/MM/AAAA"
                      value={inputValue}
                      onChange={handleInputChange}
                      maxLength={10}
                      autoComplete="bday"
                      aria-invalid={!!errors.dateOfBirth}
                      className={cn("pr-10 tabular-nums", errors.dateOfBirth && "border-red-500 focus-visible:ring-red-500")}
                    />
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-blue-600 cursor-pointer flex items-center justify-center outline-none rounded-r-md transition-colors"
                      >
                        <CalendarIcon className="size-4" />
                      </button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="center" sideOffset={8}>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      captionLayout="dropdown"
                      // 🟢 Restrição visual no Calendário
                      fromYear={minDate.getFullYear()}
                      toYear={maxDateForPro.getFullYear()}
                      onSelect={(date) => {
                        field.onChange(date)
                        setCalendarOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )
            }}
          />
          {errors.dateOfBirth && (
            <span className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">
              {errors.dateOfBirth.message}
            </span>
          )}
        </Field>

        <Field>
          <FieldLabel className={cn(errors.gender && "text-red-500")}>Gênero</FieldLabel>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEMININE" className="cursor-pointer">
                    <div className="flex items-center gap-2"><Venus className="h-4 w-4 text-rose-500" /> Feminino</div>
                  </SelectItem>
                  <SelectItem value="MASCULINE" className="cursor-pointer">
                    <div className="flex items-center gap-2"><Mars className="h-4 w-4 text-blue-500" /> Masculino</div>
                  </SelectItem>
                  <SelectItem value="OTHER" className="cursor-pointer">
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-violet-500" /> Outro</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Button
          disabled={isSubmitting}
          className="cursor-pointer h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-[transform,background-color] duration-200 font-medium w-full outline-none"
          type="submit"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <span>{isSubmitting ? "Criando conta…" : "Criar conta"}</span>
        </Button>

        <FieldDescription className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
          Ao continuar, você concorda com nossos{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">termos de serviço</a> e{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">políticas de privacidade</a>.
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}