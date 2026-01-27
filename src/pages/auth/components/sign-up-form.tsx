"use client"

import { useCallback, useState, useEffect, type ChangeEvent } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff, CalendarIcon, Loader2 } from "lucide-react"
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

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
  <Input ref={inputRef} {...props} />
))

export const signUpFormSchema = z.object({
  firstName: z.string().min(1, "Obrigatório"),
  lastName: z.string().min(1, "Obrigatório"),
  phoneNumber: z.string().min(1, "Obrigatório").max(15),
  email: z.string().email("Email inválido").min(1, "Obrigatório"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  dateOfBirth: z.date({
    message: "Obrigatório",
  }),
  cpf: z.string().min(11, "CPF inválido").max(14),
  gender: z.enum(["MASCULINE", "FEMININE", "OTHER"], {
    message: "Obrigatório",
  }),
  expertise: z.enum([
    "OTHER",
    "SOCIAL",
    "INFANT",
    "CLINICAL",
    "JURIDICAL",
    "PSYCHOTHERAPIST",
    "NEUROPSYCHOLOGY",
  ], {
    message: "Obrigatório",
  }),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

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
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  })

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
        role: "PSYCHOLOGIST"
      })

      toast.success("Psicólogo cadastrado com sucesso!")
      navigate("/sign-in")
    } catch (err: any) {
      const response = err.response;
      const status = response?.status;
      const responseData = response?.data;

      const message = Array.isArray(responseData?.message)
        ? responseData.message[0]
        : responseData?.message;

      if (status === 409) {
        if (message === 'EMAIL_ALREADY_EXISTS') {
          setError("email", { type: "manual", message: "E-mail já cadastrado" });
          toast.error("E-mail já cadastrado", {
            description: "Este e-mail já está vinculado a uma conta. Tente fazer login.",
          });
          return;
        }

        if (message === 'CPF_ALREADY_EXISTS') {
          setError("cpf", { type: "manual", message: "CPF já cadastrado" });
          toast.error("CPF já cadastrado", {
            description: "Este CPF já possui um cadastro ativo no sistema.",
          });
          return;
        }
      }

      toast.error("Erro ao realizar cadastro", {
        description: "Verifique sua conexão ou tente novamente em instantes."
      });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName" className={cn(errors.firstName && "text-red-500")}>Primeiro Nome</FieldLabel>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Jon"
              className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName" className={cn(errors.lastName && "text-red-500")}>Último Nome</FieldLabel>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Doe"
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
            placeholder="exemplo@mindflush.com"
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
              placeholder="Minimo 6 Dígitos"
              className={cn("pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className={cn(errors.phoneNumber && "border-red-500 focus-visible:ring-red-500")}
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
                  className={cn(errors.cpf && "border-red-500 focus-visible:ring-red-500")}
                />
              )}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel className={cn(errors.dateOfBirth && "text-red-500")}>Data de Nascimento</FieldLabel>
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
                  if (!isNaN(date.getTime()) && date.getFullYear() === year && year > 1900) {
                    field.onChange(date)
                  }
                }
              }

              return (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <div className="relative w-full">
                    <Input
                      placeholder="DD/MM/AAAA"
                      value={inputValue}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={cn("pr-10", errors.dateOfBirth && "border-red-500 focus-visible:ring-red-500")}
                    />
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer text-muted-foreground"
                      >
                        <CalendarIcon className="size-4" />
                      </Button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="center"
                    sideOffset={8}
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
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
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel className={cn(errors.gender && "text-red-500")}>Gênero</FieldLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("cursor-pointer", errors.gender && "border-red-500 ring-red-500")}>
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MASCULINE" className="cursor-pointer">Masculino</SelectItem>
                    <SelectItem value="FEMININE" className="cursor-pointer">Feminino</SelectItem>
                    <SelectItem value="OTHER" className="cursor-pointer">Outro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel className={cn(errors.expertise && "text-red-500")}>Especialidade</FieldLabel>
            <Controller
              name="expertise"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("cursor-pointer", errors.expertise && "border-red-500 ring-red-500")}>
                    <SelectValue placeholder="Especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLINICAL" className="cursor-pointer">Clínica</SelectItem>
                    <SelectItem value="INFANT" className="cursor-pointer">Infantil</SelectItem>
                    <SelectItem value="NEUROPSYCHOLOGY" className="cursor-pointer">Neuropsicologia</SelectItem>
                    <SelectItem value="PSYCHOTHERAPIST" className="cursor-pointer">Psicoterapeuta</SelectItem>
                    <SelectItem value="JURIDICAL" className="cursor-pointer">Jurídica</SelectItem>
                    <SelectItem value="SOCIAL" className="cursor-pointer">Social</SelectItem>
                    <SelectItem value="OTHER" className="cursor-pointer">Outro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <Button disabled={isSubmitting} className="cursor-pointer h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-medium w-full" type="submit">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>

        <FieldDescription className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
          Ao continuar, você concorda com nossos{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground cursor-pointer">termos de serviço</a> e{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground cursor-pointer">políticas de privacidade</a>.
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}