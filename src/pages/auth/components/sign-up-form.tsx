"use client"

import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { ChevronDownIcon } from "lucide-react"
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
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"

// Schema Zod (você pode querer mover isso para um arquivo 'schemas.ts' dedicado)
export const signUpForm = z.object({
  firstName: z.string().min(1, "Primeiro nome é obrigatório"),
  lastName: z.string().min(1, "Último nome é obrigatório"),
  phoneNumber: z.string().min(1, "Telefone é obrigatório").max(15),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").optional(),
  dateOfBirth: z.date(),
  cpf: z.string().min(11, "CPF inválido").max(14),
  role: z.enum(["PATIENT", "PSYCHOLOGIST"]),
  gender: z.enum(["MASCULINE", "FEMININE", "OTHER"]),
  expertise: z.enum([
    "OTHER",
    "SOCIAL",
    "INFANT",
    "CLINICAL",
    "JURIDICAL",
    "PSYCHOTHERAPIST",
    "NEUROPSYCHOLOGY",
  ]),
  isActive: z.boolean().optional(),
  profileImageUrl: z.string().url().optional(),
  crp: z.string().optional(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<SignUpForm>()

  const { mutateAsync: registerPsychologistFn } = useMutation({
    mutationFn: registerPsychologist,
  })

  async function handleSignUp(data: SignUpForm) {
    try {
      await registerPsychologistFn({
        ...data,
        phoneNumber: data.phoneNumber.replace(/\D/g, ""),
        cpf: data.cpf.replace(/\D/g, ""),
      })

      toast.success("Psicólogo cadastrado com sucesso!", {
        action: {
          label: "Login",
          onClick: () => navigate(`/sign-in?email=${data.email}`),
        },
      })
    } catch {
      toast.error("Erro ao cadastrar psicólogo.")
    }
  }

  const phoneValue = watch("phoneNumber")
  const cpfValue = watch("cpf")

  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">Primeiro Nome</FieldLabel>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Jon"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Último Nome</FieldLabel>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Doe"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">E-mail profissional</FieldLabel>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="exemplo@mindflush.com"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="••••••••"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="phoneNumber">Telefone</FieldLabel>
            <Input
              id="phoneNumber"
              value={formatPhone(phoneValue || "")}
              onChange={(e) => setValue("phoneNumber", e.target.value)}
              placeholder="(99) 99999-9999"
              maxLength={15}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="cpf">CPF</FieldLabel>
            <Input
              id="cpf"
              value={formatCPF(cpfValue || "")}
              onChange={(e) => setValue("cpf", e.target.value)}
              placeholder="123.456.789-00"
              maxLength={14}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Data de Nascimento</FieldLabel>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between font-normal ${
                      !field.value && "text-muted-foreground"
                    }`}
                  >
                    {field.value
                      ? field.value.toLocaleDateString("pt-BR")
                      : "Selecione a data"}
                    <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </Field>

        <Field>
          <FieldLabel>Função</FieldLabel>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PSYCHOLOGIST">Psicólogo</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Gênero</FieldLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MASCULINE">Masculino</SelectItem>
                    <SelectItem value="FEMININE">Feminino</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Especialidade</FieldLabel>
            <Controller
              name="expertise"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLINICAL">Clínica</SelectItem>
                    <SelectItem value="INFANT">Infantil</SelectItem>
                    <SelectItem value="NEUROPSYCHOLOGY">
                      Neuropsicologia
                    </SelectItem>
                    <SelectItem value="PSYCHOTHERAPIST">
                      Psicoterapeuta
                    </SelectItem>
                    <SelectItem value="JURIDICAL">Jurídica</SelectItem>
                    <SelectItem value="SOCIAL">Social</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <Field>
          <Button
            disabled={isSubmitting}
            className="w-full"
            type="submit"
          >
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-2 sm:px-6 text-center text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              termos de serviço
            </a>{" "}
            e{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              políticas de privacidade
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}