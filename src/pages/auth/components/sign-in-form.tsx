import type React from "react"
import { memo, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/api/sign-in"
import { env } from "@/env"

const signInSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
})

type SignInSchema = z.infer<typeof signInSchema>

interface UserWithRole {
  id: string
  email: string
  role: string | { name: string }
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
}

export const SignInForm = memo(function SignInForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const prefersReduced = useReducedMotion()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: "",
    },
  })

  const { mutateAsync: authenticate } = useMutation({ mutationFn: signIn })

  const handleSignIn = useCallback(
    async (data: SignInSchema) => {
      try {
        const response = await authenticate(data) as unknown as { user: UserWithRole }
        const user = response.user

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("user", JSON.stringify(user))

        const roleValue = typeof user.role === "object" && user.role !== null
          ? (user.role as { name: string }).name
          : user.role
        const role = String(roleValue).trim().toUpperCase()

        toast.success("Login realizado com sucesso!", { duration: 2000 })

        setTimeout(() => {
          navigate(role === "SUPER_ADMIN" ? "/admin-dashboard" : "/dashboard", { replace: true })
        }, 100)
      } catch (error: any) {
        if (error?.response?.status === 401) {
          toast.error("Credenciais inválidas. Verifique seu e-mail e senha.")
        } else {
          toast.error(error?.response?.data?.message || "Ocorreu um erro inesperado.")
        }
      }
    },
    [authenticate, navigate],
  )

  const togglePasswordVisibility = useCallback(() => setShowPassword((p) => !p), [])

  const animItem = prefersReduced ? {} : { variants: itemVariants }

  return (
    <motion.form
      onSubmit={handleSubmit(handleSignIn)}
      className={cn("flex flex-col gap-4", className)}
      variants={prefersReduced ? undefined : containerVariants}
      initial={prefersReduced ? undefined : "hidden"}
      animate={prefersReduced ? undefined : "visible"}
      {...(props as any)}
    >
      {/* Google */}
      <motion.div {...animItem}>
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 gap-2 font-medium cursor-pointer"
          onClick={() => { window.location.href = `${env.VITE_API_URL}/auth/google` }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Entrar com Google
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div {...animItem} className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-50 px-2 text-muted-foreground">Ou</span>
        </div>
      </motion.div>

      {/* Email */}
      <motion.div {...animItem} className="space-y-2">
        <Label htmlFor="email">E-mail profissional</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} aria-hidden="true" />
          <Input
            id="email"
            type="email"
            placeholder="exemplo@mindflush.com"
            autoComplete="email"
            className={cn("pl-9 h-11", errors.email && "border-red-500 focus-visible:ring-red-500/20")}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </motion.div>

      {/* Password */}
      <motion.div {...animItem} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Link
            to="/forgot-password"
            className="text-xs text-muted-foreground hover:text-blue-600 transition-colors underline-offset-4 hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} aria-hidden="true" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className={cn("pl-9 pr-10 h-11", errors.password && "border-red-500 focus-visible:ring-red-500/20")}
            {...register("password")}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </motion.div>

      {/* Submit */}
      <motion.div {...animItem}>
        <Button
          disabled={isSubmitting}
          type="submit"
          className="cursor-pointer w-full h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-medium text-white"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Entrando...
            </span>
          ) : (
            "Entrar"
          )}
        </Button>
      </motion.div>

      {/* Sign-up link */}
      <motion.div {...animItem}>
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            to="/sign-up"
            className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </motion.div>
    </motion.form>
  )
})
