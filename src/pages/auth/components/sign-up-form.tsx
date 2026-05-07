import { useCallback, useState, useEffect, type ChangeEvent } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff, CalendarIcon, Loader2, Mars, Users, Venus } from "lucide-react"
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
import { registerPsychologist } from "@/api/create-user"
import { env } from "@/env"

const today = new Date()
const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
const maxDateForPro = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "")
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) return false
  let sum = 0, remainder
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
  dateOfBirth: z.date({ message: "Obrigatório" })
    .refine((d) => d >= minDate, { message: "Data inválida." })
    .refine((d) => d <= maxDateForPro, { message: "Necessário ter 18+ anos." }),
  cpf: z.string().min(11, "CPF incompleto").refine(isValidCPF, "CPF inválido"),
  gender: z.enum(["MASCULINE", "FEMININE", "OTHER"], { message: "Obrigatório" }),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
  <Input ref={inputRef} {...props} />
))

function FieldRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-2 gap-3", className)}>{children}</div>
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
    <div className={cn("flex flex-col gap-1", className)}>
      <label className={cn("text-xs font-medium text-foreground/70", error && "text-red-500")}>
        {label}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 px-1">{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

function PasswordStrength({ value }: { value: string }) {
  const checks = [
    value.length >= 8 && value.length <= 30,
    /[A-Z]/.test(value),
    /[a-z]/.test(value),
    /\d/.test(value),
    /[!@#$%^&*]/.test(value),
  ]
  const score = checks.filter(Boolean).length

  const barColor =
    score <= 1 ? "bg-red-500" :
    score <= 2 ? "bg-orange-400" :
    score <= 3 ? "bg-yellow-500" :
    score <= 4 ? "bg-blue-500" :
                 "bg-green-500"

  const label =
    score === 0 ? "" :
    score <= 1 ? "Fraca" :
    score <= 2 ? "Razoável" :
    score <= 3 ? "Boa" :
    score <= 4 ? "Forte" :
                 "Muito forte"

  const labelColor =
    score <= 1 ? "text-red-500" :
    score <= 2 ? "text-orange-500" :
    score <= 3 ? "text-yellow-600" :
    score <= 4 ? "text-blue-600" :
                 "text-green-600"

  if (!value) return null

  return (
    <div className="mt-1 space-y-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= score ? barColor : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[10px] text-muted-foreground">
          Use maiúsc., minúsc., número e símbolo
        </p>
        {label && <p className={cn("text-[10px] font-semibold", labelColor)}>{label}</p>}
      </div>
    </div>
  )
}

export function SignUpForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [dobInputValue, setDobInputValue] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { password: "" },
  })

  const passwordValue = watch("password", "")
  const dobFieldValue = watch("dateOfBirth")

  useEffect(() => {
    if (dobFieldValue instanceof Date && !isNaN(dobFieldValue.getTime())) {
      setDobInputValue(dobFieldValue.toLocaleDateString("pt-BR"))
    }
  }, [dobFieldValue])

  const { mutateAsync: registerPsychologistFn } = useMutation({ mutationFn: registerPsychologist })

  const togglePasswordVisibility = useCallback(() => setShowPassword((p) => !p), [])

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
      const status = err.response?.status
      const message = Array.isArray(err.response?.data?.message)
        ? err.response.data.message[0]
        : err.response?.data?.message

      if (status === 409) {
        if (message === "EMAIL_ALREADY_EXISTS") {
          setError("email", { type: "manual", message: "E-mail já cadastrado" })
          toast.error("E-mail já cadastrado")
          return
        }
        if (message === "CPF_ALREADY_EXISTS") {
          setError("cpf", { type: "manual", message: "CPF já cadastrado" })
          toast.error("CPF já cadastrado")
          return
        }
      }
      toast.error("Erro ao realizar cadastro")
    }
  }

  const onInvalid = () => toast.error("Preencha corretamente os campos destacados.")

  return (
    <form
      onSubmit={handleSubmit(handleSignUp, onInvalid)}
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 font-medium cursor-pointer"
        onClick={() => { window.location.href = `${env.VITE_API_URL}/auth/google` }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Cadastrar com Google
      </Button>

      {/* OR divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-50 px-2 text-muted-foreground">Ou</span>
        </div>
      </div>

      {/* ── Dados Pessoais ── */}
      <SectionHeading>Dados Pessoais</SectionHeading>

      <FieldRow>
        <FieldWrap label="Primeiro Nome" error={errors.firstName?.message}>
          <Input
            {...register("firstName")}
            placeholder="Jon"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            className={cn(errors.firstName && "border-red-500")}
          />
        </FieldWrap>
        <FieldWrap label="Último Nome" error={errors.lastName?.message}>
          <Input
            {...register("lastName")}
            placeholder="Doe"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            className={cn(errors.lastName && "border-red-500")}
          />
        </FieldWrap>
      </FieldRow>

      <FieldRow>
        <FieldWrap label="Telefone" error={errors.phoneNumber?.message}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { ref, ...fieldProps } }) => (
              <MaskedInput
                {...fieldProps}
                inputRef={ref}
                mask="(00) 00000-0000"
                placeholder="(99) 99999-9999"
                type="tel"
                autoComplete="tel"
                className={cn("tabular-nums", errors.phoneNumber && "border-red-500")}
              />
            )}
          />
        </FieldWrap>
        <FieldWrap label="CPF" error={errors.cpf?.message}>
          <Controller
            control={control}
            name="cpf"
            render={({ field: { ref, ...fieldProps } }) => (
              <MaskedInput
                {...fieldProps}
                inputRef={ref}
                mask="000.000.000-00"
                placeholder="123.456.789-00"
                autoComplete="off"
                className={cn("tabular-nums", errors.cpf && "border-red-500")}
              />
            )}
          />
        </FieldWrap>
      </FieldRow>

      <FieldRow>
        <FieldWrap label="Data de Nascimento" error={errors.dateOfBirth?.message}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => {
              const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
                let val = e.target.value.replace(/\D/g, "")
                if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2)
                if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9)
                setDobInputValue(val)
                if (val.length === 10) {
                  const [day, month, year] = val.split("/").map(Number)
                  const date = new Date(year, month - 1, day)
                  if (!isNaN(date.getTime()) && date.getFullYear() === year && year >= minDate.getFullYear()) {
                    field.onChange(date)
                  }
                }
              }
              return (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <div className="relative">
                    <Input
                      placeholder="DD/MM/AAAA"
                      value={dobInputValue}
                      onChange={handleInputChange}
                      maxLength={10}
                      autoComplete="bday"
                      aria-invalid={!!errors.dateOfBirth}
                      className={cn("pr-9 tabular-nums", errors.dateOfBirth && "border-red-500")}
                    />
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="absolute right-0 top-0 h-full px-2.5 text-muted-foreground hover:text-blue-600 cursor-pointer flex items-center outline-none rounded-r-md transition-colors"
                      >
                        <CalendarIcon className="size-3.5" />
                      </button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start" sideOffset={6}>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      captionLayout="dropdown"
                      fromYear={minDate.getFullYear()}
                      toYear={maxDateForPro.getFullYear()}
                      onSelect={(date) => { field.onChange(date); setCalendarOpen(false) }}
                    />
                  </PopoverContent>
                </Popover>
              )
            }}
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
                  <SelectItem value="FEMININE" className="cursor-pointer">
                    <div className="flex items-center gap-2"><Venus className="h-3.5 w-3.5 text-rose-500" /> Feminino</div>
                  </SelectItem>
                  <SelectItem value="MASCULINE" className="cursor-pointer">
                    <div className="flex items-center gap-2"><Mars className="h-3.5 w-3.5 text-blue-500" /> Masculino</div>
                  </SelectItem>
                  <SelectItem value="OTHER" className="cursor-pointer">
                    <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-violet-500" /> Outro</div>
                  </SelectItem>
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
          {...register("email")}
          placeholder="exemplo@mindflush.com"
          autoComplete="email"
          spellCheck={false}
          aria-invalid={!!errors.email}
          className={cn(errors.email && "border-red-500")}
        />
      </FieldWrap>

      <FieldWrap label="Senha" error={errors.password?.message}>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Crie uma senha forte"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            className={cn("pr-9", errors.password && "border-red-500")}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors outline-none rounded-sm"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <PasswordStrength value={passwordValue} />
      </FieldWrap>

      {/* Submit */}
      <Button
        disabled={isSubmitting}
        className="w-full mt-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-medium text-white cursor-pointer"
        type="submit"
      >
        {isSubmitting
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta…</>
          : "Criar conta"
        }
      </Button>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        Ao continuar você aceita os{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground">termos</a>
        {" "}e a{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground">privacidade</a>.
        {" · "}
        <Link to="/sign-in" className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline">
          Fazer login
        </Link>
      </p>
    </form>
  )
}
