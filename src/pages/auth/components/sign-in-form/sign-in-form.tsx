import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { EmailInput } from '@/components/form-fields/email-input/email-input'
import { PasswordInput } from '@/components/form-fields/password-input/password-input'

import { signIn } from '@/api/auth/sign-in'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import { GoogleAuthButton } from '../google-auth-button/google-auth-button'
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
}: {
  className?: string
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const prefersReduced = useReducedMotion()

  const methods = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        await authenticate(data)
        toast.success('Login realizado com sucesso!', { duration: 2000 })
        navigate('/dashboard', { replace: true })
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, 'Erro ao entrar. Tente novamente.'),
        )
      }
    },
    [authenticate, navigate],
  )

  const animItem = prefersReduced ? {} : { variants: itemVariants }

  return (
    <Form {...methods}>
      <motion.form
        onSubmit={handleSubmit(handleSignIn)}
        className={cn('flex flex-col gap-4', className)}
        variants={prefersReduced ? undefined : containerVariants}
        initial={prefersReduced ? undefined : 'hidden'}
        animate={prefersReduced ? undefined : 'visible'}
      >
        <motion.div {...animItem}>
          <GoogleAuthButton />
        </motion.div>

        <motion.div {...animItem} className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </motion.div>

        <motion.div {...animItem}>
          <EmailInput<SignInFormData>
            name="email"
            label="E-mail profissional"
            placeholder="exemplo@mindflush.com"
          />
        </motion.div>

        <motion.div {...animItem} className="flex flex-col gap-1">
          <PasswordInput<SignInFormData> name="password" label="Senha" />
          <Link
            to="/forgot-password"
            className="self-end text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </motion.div>

        <motion.div {...animItem}>
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </motion.div>

        <motion.div {...animItem}>
          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link
              to="/sign-up"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </Form>
  )
})
