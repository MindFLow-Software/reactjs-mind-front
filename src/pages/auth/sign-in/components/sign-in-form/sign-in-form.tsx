import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { EmailInput } from '@/components/form-fields/email-input/email-input'
import { PasswordInput } from '@/components/form-fields/password-input/password-input'

import { GoogleAuthButton } from '../../../components/google-auth-button/google-auth-button'
import { AuthDivider } from '../../../components/auth-divider/auth-divider'
import { useSignIn } from '../../hooks/use-sign-in'
import {
  signInSchema,
  type ISignInFormData,
} from '@/validators/auth/form/sign-in-schema'

import './sign-in-form.css'

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

export const SignInForm = memo(function SignInForm() {
  const [searchParams] = useSearchParams()
  const prefersReduced = useReducedMotion()

  const { signIn, isSigningIn } = useSignIn()

  const methods = useForm<ISignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: '',
    },
  })

  const { handleSubmit } = methods

  const handleSignIn = useCallback(
    (data: ISignInFormData) => {
      signIn(data)
    },
    [signIn],
  )

  const animItem = prefersReduced ? {} : { variants: itemVariants }

  return (
    <Form {...methods}>
      <motion.form
        onSubmit={handleSubmit(handleSignIn)}
        className="sif-root"
        variants={prefersReduced ? undefined : containerVariants}
        initial={prefersReduced ? undefined : 'hidden'}
        animate={prefersReduced ? undefined : 'visible'}
      >
        <motion.div {...animItem}>
          <GoogleAuthButton />
        </motion.div>

        <motion.div {...animItem}>
          <AuthDivider label="ou" />
        </motion.div>

        <motion.div {...animItem}>
          <EmailInput<ISignInFormData>
            name="email"
            label="E-mail profissional"
            placeholder="exemplo@mindflush.com"
          />
        </motion.div>

        <motion.div {...animItem} className="sif-password-field">
          <PasswordInput<ISignInFormData>
            name="password"
            label="Senha"
            placeholder="••••••••"
          />
          <Link to="/forgot-password" className="sif-forgot-link">
            Esqueceu a senha?
          </Link>
        </motion.div>

        <motion.footer {...animItem} className="sif-footer">
          <motion.div {...animItem}>
            <Button disabled={isSigningIn} type="submit" className="w-full">
              {isSigningIn ? (
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
            <p className="sif-signup-hint">
              Não tem uma conta?{' '}
              <Link to="/sign-up" className="sif-signup-link">
                Criar conta
              </Link>
            </p>
          </motion.div>
        </motion.footer>
      </motion.form>
    </Form>
  )
})
