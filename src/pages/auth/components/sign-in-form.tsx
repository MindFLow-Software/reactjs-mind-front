import { memo, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signIn } from '@/api/auth/sign-in'
import { Sanitize } from '@/utils/Sanitizer'
import { GoogleAuthButton } from './google-auth-button'
import {
  signInSchema,
  type SignInFormData,
} from '@/validators/auth/form/sign-in-schema'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
}

export const SignInForm = memo(function SignInForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const prefersReduced = useReducedMotion()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: '',
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        await authenticate(data)

        localStorage.setItem('isAuthenticated', 'true')

        toast.success('Login realizado com sucesso!', { duration: 2000 })

        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 100)
      } catch (error) {
        const errorMessage = Sanitize.responseError(error)
        toast.error(errorMessage)
      }
    },
    [authenticate, navigate],
  )

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((p) => !p),
    [],
  )

  const animItem = prefersReduced ? {} : { variants: itemVariants }

  return (
    <motion.form
      onSubmit={handleSubmit(handleSignIn)}
      className={cn('flex flex-col gap-4', className)}
      variants={prefersReduced ? undefined : containerVariants}
      initial={prefersReduced ? undefined : 'hidden'}
      animate={prefersReduced ? undefined : 'visible'}
      // eslint-disable-next-line
      {...(props as any)}
    >
      {/* Google */}
      <motion.div {...animItem}>
        <GoogleAuthButton />
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
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={16}
            aria-hidden="true"
          />
          <Input
            id="email"
            type="email"
            placeholder="exemplo@mindflush.com"
            autoComplete="email"
            className={cn(
              'pl-9 h-11',
              errors.email && 'border-red-500 focus-visible:ring-red-500/20',
            )}
            {...register('email')}
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
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={16}
            aria-hidden="true"
          />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className={cn(
              'pl-9 pr-10 h-11',
              errors.password && 'border-red-500 focus-visible:ring-red-500/20',
            )}
            {...register('password')}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
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
            'Entrar'
          )}
        </Button>
      </motion.div>

      {/* Sign-up link */}
      <div className="flex flex-col gap-2">
        <motion.div {...animItem}>
          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link
              to="/sign-up"
              className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.form>
  )
})
