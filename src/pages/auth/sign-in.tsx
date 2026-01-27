"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { SignInForm } from "./components/sign-in-form"
import { api } from "@/lib/axios"

export function SignIn() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkAuthentication() {
      const isAuthenticatedFlag = localStorage.getItem('isAuthenticated') === 'true'

      if (!isAuthenticatedFlag) {
        if (isMounted) setIsChecking(false)
        return
      }

      try {
        await api.get('/psychologist/me')

        if (isMounted) {
          navigate('/dashboard', { replace: true })
        }
      } catch (error) {
        if (isMounted) {
          localStorage.removeItem('isAuthenticated')
          setIsChecking(false)
        }
      }
    }

    checkAuthentication()

    return () => {
      isMounted = false
    }
  }, [navigate])

  if (isChecking) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet title="Entrar no MindFlush" />
      <div className="flex min-h-svh justify-center p-4 sm:p-8">
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