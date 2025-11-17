import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { SignInForm } from "./components/sign-in-form"
import { Button } from "@/components/ui/button"

export function SignIn() {
  return (
    <>
      <Helmet title="Entrar no MindFlush" />
      {/* SEU LAYOUT ORIGINAL, CENTRALIZADO E COM MAX-W-[450PX] */}
      <div className="flex min-h-svh justify-center p-4 sm:p-8"> {/* Removido items-center */}
        <Button
          variant={"link"}
          asChild
          className="absolute right-4 top-4 sm:right-8 sm:top-8"
        >
          <Link to="/sign-up">Criar Conta</Link>
        </Button>

        {/* Mantido o max-w-[450px] e o pt-16 para padronização */}
        <div className="flex w-full max-w-[450px] flex-col justify-center gap-6 pt-16">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bem-vindo(a) ao <span className="text-blue-700">MindFlush</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Faça login para acessar seu painel e acompanhar seus pacientes com
              mais clareza e conexão.
            </p>
          </div>

          <SignInForm /> 
        </div>
      </div>
    </>
  )
}