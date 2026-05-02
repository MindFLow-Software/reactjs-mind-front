import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Helmet } from "react-helmet-async"
import { Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { completeGoogleRegistration } from "@/api/complete-google-registration"
import { getProfile } from "@/api/get-profile"
import { EXPERTISE_TRANSLATIONS } from "@/utils/mappers"
import type { Expertise } from "@/types/expertise"
import type { Gender } from "@/types/enum-gender"

const completeSchema = z.object({
  crp: z.string().min(1, "CRP é obrigatório"),
  expertise: z.enum(["CLINICAL", "SOCIAL", "INFANT", "JURIDICAL", "PSYCHOTHERAPIST", "NEUROPSYCHOLOGY", "OTHER"], {
    error: "Selecione uma especialidade",
  }),
  gender: z.enum(["MASCULINE", "FEMININE", "OTHER"], {
    error: "Selecione um gênero",
  }),
})

type CompleteSchema = z.infer<typeof completeSchema>

const GENDER_LABELS: Record<Gender, string> = {
  MASCULINE: "Masculino",
  FEMININE: "Feminino",
  OTHER: "Prefiro não informar",
}

export function GoogleOAuthComplete() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [token] = useState(() => searchParams.get("token"))

  useEffect(() => {
    if (!token) {
      toast.error("Link de cadastro inválido. Tente novamente com o Google.")
      navigate("/sign-in", { replace: true })
    }
  }, [token, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteSchema>({
    resolver: zodResolver(completeSchema),
  })

  const { mutateAsync: complete, isPending } = useMutation({
    mutationFn: completeGoogleRegistration,
  })

  async function handleComplete(data: CompleteSchema) {
    try {
      await complete({
        token: token!,
        crp: data.crp,
        expertise: data.expertise as Expertise,
        gender: data.gender as Gender,
      })

      const profile = await getProfile()
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(profile))

      navigate("/dashboard", { replace: true })
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 400 || status === 404) {
        toast.error("Link de cadastro expirado. Tente novamente com o Google.")
        navigate("/sign-in", { replace: true })
      } else {
        toast.error(error?.response?.data?.message ?? "Ocorreu um erro. Tente novamente.")
      }
    }
  }

  if (!token) return null

  return (
    <>
      <Helmet title="Complete seu cadastro | MindFlush" />
      <div className="flex min-h-svh justify-center p-4 sm:p-8">
        <div className="flex w-full max-w-[450px] flex-col justify-center gap-6 pt-16">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Quase lá! Complete seu cadastro
            </h1>
            <p className="text-sm text-muted-foreground">
              Precisamos de mais alguns dados para configurar seu perfil de psicólogo.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleComplete)} className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="crp">CRP</Label>
              <Input
                id="crp"
                placeholder="Ex: 06/12345"
                className="h-11"
                {...register("crp")}
              />
              {errors.crp && (
                <p className="text-red-500 text-xs">{errors.crp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Especialidade</Label>
              <select
                id="expertise"
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register("expertise")}
              >
                <option value="">Selecione...</option>
                {(Object.keys(EXPERTISE_TRANSLATIONS) as Expertise[]).map((key) => (
                  <option key={key} value={key}>
                    {EXPERTISE_TRANSLATIONS[key]}
                  </option>
                ))}
              </select>
              {errors.expertise && (
                <p className="text-red-500 text-xs">{errors.expertise.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <select
                id="gender"
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register("gender")}
              >
                <option value="">Selecione...</option>
                {(Object.keys(GENDER_LABELS) as Gender[]).map((key) => (
                  <option key={key} value={key}>
                    {GENDER_LABELS[key]}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs">{errors.gender.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium text-white"
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
