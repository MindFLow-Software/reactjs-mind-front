import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
// import { getProfile } from '@/api/psychologists/get-profile'
// import { refreshSession } from '@/api/auth/refresh-session'
// import { useSessionStore } from '@/store/use-session-store'
import { BrandedLoader } from '@/components/branded-loader/branded-loader'

export function GoogleOAuthSuccess() {
  const navigate = useNavigate()
  // const setSession = useSessionStore((state) => state.setSession)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    async function finishLogin() {
      try {
        // const wait = (ms: number) =>
        //   new Promise((resolve) => setTimeout(resolve, ms))

        // const fetchProfileWithRetry = async () => {
        //   let lastError: unknown

        //   for (let attempt = 0; attempt < 3; attempt++) {
        //     try {
        //       return await getProfile()
        //     } catch (error) {
        //       lastError = error
        //       await wait(250 * (attempt + 1))
        //     }
        //   }

        //   throw lastError
        // }

        // let profile

        // try {
        //   profile = await fetchProfileWithRetry()
        // } catch {
        //   await refreshSession()
        //   profile = await fetchProfileWithRetry()
        // }

        // setSession(profile)
        navigate('/dashboard', { replace: true })
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status === 400 || status === 404) {
            navigate('/sign-in', { replace: true })
            return
          }
        }
        toast.error('Não foi possível completar o login. Tente novamente.')
        navigate('/sign-in', { replace: true })
      }
    }

    finishLogin()
  }, [navigate])

  return <BrandedLoader message="Finalizando login..." />
}
