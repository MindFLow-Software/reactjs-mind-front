import { Helmet } from 'react-helmet-async'

import { useAuth } from '@/hooks/use-auth'
import { BrandedLoader } from '@/components/branded-loader/branded-loader'
import { AuthHeading } from './components/auth-heading'
import { SignInForm } from './components/sign-in-form'
import './sign-in.css'

export function SignIn() {
  const { isPending } = useAuth()

  if (isPending) return <BrandedLoader message="Verificando acesso..." />

  return (
    <>
      <Helmet title="Entrar no MindFlush" />
      <div className="signin-shell">
        <AuthHeading
          title="Entrar na MindFlush"
          subtitle="Acesse seu painel de psicólogo"
        />
        <SignInForm />
      </div>
    </>
  )
}
