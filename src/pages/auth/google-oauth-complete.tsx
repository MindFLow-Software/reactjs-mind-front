import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Helmet } from 'react-helmet-async'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { completeGoogleRegistration } from '@/api/auth/complete-google-registration'
import { getProfile } from '@/api/psychologists/get-profile'
import type { CompleteRegistrationSchema } from '@/validators/auth'
import type { Expertise } from '@/types/expertise'
import type { Gender } from '@/types/enum-gender'
import { CompleteRegistrationForm } from './components/complete-registration-form'

export function GoogleOAuthComplete() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [token] = useState(() => searchParams.get('token'))

  useEffect(() => {
    if (!token) {
      toast.error('Link de cadastro inválido. Tente novamente com o Google.')
      navigate('/sign-in', { replace: true })
    }
  }, [token, navigate])

  const { mutateAsync: complete, isPending } = useMutation({
    mutationFn: completeGoogleRegistration,
  })

  const handleSubmit = useCallback(
    async (data: CompleteRegistrationSchema) => {
      try {
        await complete({
          token: token!,
          crp: data.crp,
          expertise: data.expertise as Expertise,
          gender: data.gender as Gender,
        })
        const profile = await getProfile()
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(profile))
        navigate('/dashboard', { replace: true })
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status === 400 || status === 404) {
            toast.error('Link de cadastro expirado. Tente novamente com o Google.')
            navigate('/sign-in', { replace: true })
            return
          }
          toast.error(error.message)
        } else {
          toast.error('Ocorreu um erro. Tente novamente.')
        }
      }
    },
    [complete, navigate, token],
  )

  if (!token) return null

  return (
    <>
      <Helmet title="Complete seu cadastro | MindFlush" />
      <div className="flex min-h-svh justify-center p-4 sm:p-8">
        <div className="flex w-full max-w-[450px] flex-col justify-center gap-6 pt-16">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Quase lá!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Só precisamos de mais alguns dados para configurar seu perfil de
              psicólogo.
            </p>
          </div>
          <CompleteRegistrationForm onSubmit={handleSubmit} isPending={isPending} />
        </div>
      </div>
    </>
  )
}
