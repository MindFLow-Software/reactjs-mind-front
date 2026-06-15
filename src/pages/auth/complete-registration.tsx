import { useCallback } from 'react'
import { toast } from 'sonner'
import { Helmet } from 'react-helmet-async'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { api } from '@/lib/axios'
import { getProfile } from '@/api/psychologists/get-profile'
import { CompleteRegistrationForm, type CompleteRegistrationSchema } from './components/complete-registration-form'

async function completeRegistration(data: CompleteRegistrationSchema) {
  const response = await api.post('/auth/complete-registration', {
    crp: data.crp,
    expertise: data.expertise,
    gender: data.gender,
  })
  return response.data
}

export function CompleteRegistration() {
  const navigate = useNavigate()

  const { mutateAsync: complete, isPending } = useMutation({
    mutationFn: completeRegistration,
  })

  const handleSubmit = useCallback(
    async (data: CompleteRegistrationSchema) => {
      try {
        await complete(data)
        const profile = await getProfile()
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(profile))
        navigate('/dashboard', { replace: true })
      } catch (error: unknown) {
        const message =
          error instanceof AxiosError
            ? error.message
            : 'Ocorreu um erro. Tente novamente.'
        toast.error(message)
      }
    },
    [complete, navigate],
  )

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
