import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Helmet } from "react-helmet-async"
import { Loader2, Mars, Venus, Users } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { IMaskMixin } from "react-imask"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { api } from "@/lib/axios"
import { getProfile } from "@/api/get-profile"
import { EXPERTISE_TRANSLATIONS } from "@/utils/mappers"
import { cn } from "@/lib/utils"
import type { Expertise } from "@/types/expertise"
import type { Gender } from "@/types/enum-gender"

const completeSchema = z.object({
  crp: z.string().min(4, "CRP é obrigatório"),
  expertise: z.enum(
    ["CLINICAL", "SOCIAL", "INFANT", "JURIDICAL", "PSYCHOTHERAPIST", "NEUROPSYCHOLOGY", "OTHER"],
    { error: "Selecione uma especialidade" }
  ),
  gender: z.enum(["MASCULINE", "FEMININE", "OTHER"], {
    error: "Selecione um gênero",
  }),
})

type CompleteSchema = z.infer<typeof completeSchema>

const GENDER_OPTIONS: { value: Gender; label: string; icon: React.ReactNode }[] = [
  { value: "FEMININE",  label: "Feminino",             icon: <Venus className="h-4 w-4 text-rose-500" />   },
  { value: "MASCULINE", label: "Masculino",            icon: <Mars  className="h-4 w-4 text-blue-500" />   },
  { value: "OTHER",     label: "Prefiro não informar", icon: <Users className="h-4 w-4 text-violet-500" /> },
]

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
  <Input ref={inputRef} {...props} />
))

async function completeRegistration(data: CompleteSchema) {
  const response = await api.post("/auth/complete-registration", {
    crp: data.crp,
    expertise: data.expertise,
    gender: data.gender,
  })
  return response.data
}

export function CompleteRegistration() {
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteSchema>({
    resolver: zodResolver(completeSchema),
  })

  const { mutateAsync: complete, isPending } = useMutation({
    mutationFn: completeRegistration,
  })

  async function handleComplete(data: CompleteSchema) {
    try {
      await complete(data)

      const profile = await getProfile()
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(profile))

      navigate("/dashboard", { replace: true })
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Ocorreu um erro. Tente novamente.")
    }
  }

  return (
    <>
      <Helmet title="Complete seu cadastro | MindFlush" />

      <div className="flex min-h-svh justify-center p-4 sm:p-8">
        <div className="flex w-full max-w-[450px] flex-col justify-center gap-6 pt-16">

          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Quase lá!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Só precisamos de mais alguns dados para configurar seu perfil de psicólogo.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleComplete)} className="flex flex-col gap-6">
            <FieldGroup className="flex flex-col gap-4">

              <Field>
                <FieldLabel htmlFor="crp" className={cn(errors.crp && "text-red-500")}>
                  CRP
                </FieldLabel>
                <Controller
                  name="crp"
                  control={control}
                  render={({ field: { ref, ...fieldProps } }) => (
                    <MaskedInput
                      {...fieldProps}
                      inputRef={ref}
                      id="crp"
                      mask="00/000000"
                      placeholder="Ex: 06/123456"
                      autoComplete="off"
                      className={cn(
                        "h-11 tabular-nums",
                        errors.crp && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                  )}
                />
                {errors.crp && (
                  <p className="text-red-500 text-xs font-bold uppercase tracking-tight">
                    {errors.crp.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel className={cn(errors.expertise && "text-red-500")}>
                  Especialidade
                </FieldLabel>
                <Controller
                  name="expertise"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn(
                          "w-full cursor-pointer h-11",
                          errors.expertise && "border-red-500 focus-visible:ring-red-500"
                        )}
                      >
                        <SelectValue placeholder="Selecione sua especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(EXPERTISE_TRANSLATIONS) as Expertise[]).map((key) => (
                          <SelectItem key={key} value={key} className="cursor-pointer">
                            {EXPERTISE_TRANSLATIONS[key]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.expertise && (
                  <p className="text-red-500 text-xs font-bold uppercase tracking-tight">
                    {errors.expertise.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel className={cn(errors.gender && "text-red-500")}>
                  Gênero
                </FieldLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn(
                          "w-full cursor-pointer h-11",
                          errors.gender && "border-red-500 focus-visible:ring-red-500"
                        )}
                      >
                        <SelectValue placeholder="Selecione seu gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map(({ value, label, icon }) => (
                          <SelectItem key={value} value={value} className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              {icon}
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-red-500 text-xs font-bold uppercase tracking-tight">
                    {errors.gender.message}
                  </p>
                )}
              </Field>

            </FieldGroup>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-medium text-white cursor-pointer"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Salvando...
                </span>
              ) : (
                "Concluir cadastro"
              )}
            </Button>
          </form>

        </div>
      </div>
    </>
  )
}
