import { Helmet } from 'react-helmet-async'

import { useAuth } from '@/hooks/use-auth'
import { BrandedLoader } from '@/components/branded-loader/branded-loader'

import { AuthHeading } from '../components/auth-heading/auth-heading'
import { SignInForm } from './components/sign-in-form/sign-in-form'
import { useOAuthErrorToast } from './hooks/use-oauth-error-toast'

import './sign-in-page.css'

export function SignInPage() {
  const { isPending } = useAuth()

  useOAuthErrorToast()

  if (isPending) return <BrandedLoader message="Verificando acesso..." />

  return (
    <>
      <Helmet title="Entrar no MindFlush" />

      <div className="sip-shell">
        <AuthHeading
          title="Entrar na MindFlush"
          subtitle="Acesse seu painel de psicólogo"
        />
        <SignInForm />
      </div>
    </>
  )
}
