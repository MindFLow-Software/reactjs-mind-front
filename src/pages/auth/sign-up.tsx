import { Helmet } from 'react-helmet-async'

import { AuthHeading } from './components/auth-heading'
import { SignUpForm } from './components/sign-up-form'
import './sign-up.css'

export function SignUp() {
  return (
    <>
      <Helmet title="Criar conta | MindFlush" />

      <div className="signup-shell">
        <AuthHeading
          title="Crie sua conta"
          subtitle="Cadastre seus dados profissionais para começar a usar a plataforma."
        />

        <SignUpForm />
      </div>
    </>
  )
}
