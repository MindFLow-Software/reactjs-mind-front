import { Helmet } from "react-helmet-async"
import { BrainIcon } from "@phosphor-icons/react"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { SignInForm } from "./components/sign-in-form"

function BrandedLoader() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-gray-50">
      <BrainIcon className="h-10 w-10 text-blue-600" weight="duotone" />
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p className="text-sm text-gray-400">Verificando acesso...</p>
    </div>
  )
}

export function SignIn() {
  const { isChecking } = useAuthRedirect()

  if (isChecking) return <BrandedLoader />

  return (
    <>
      <Helmet title="Entrar no MindFlush" />
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Entrar na MindFlush
          </h1>
          <p className="text-sm text-gray-500">
            Acesse seu painel de psicólogo
          </p>
        </div>
        <SignInForm />
      </div>
    </>
  )
}
