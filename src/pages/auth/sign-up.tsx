import { Helmet } from "react-helmet-async"
import { SignUpForm } from "./components/sign-up-form"

export function SignUp() {
  return (
    <>
      <Helmet title="Criar conta | MindFlush" />

      <div className="w-full max-w-[520px]">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Crie sua conta
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Cadastre seus dados profissionais para começar a usar a plataforma.
          </p>
        </div>

        <SignUpForm />
      </div>
    </>
  )
}
