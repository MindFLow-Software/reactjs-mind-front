import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '@/api/psychologists/get-profile'

export function useAuthRedirect(): { isChecking: boolean } {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkAuthentication() {
      try {
        const profile = await getProfile()

        if (!isMounted) return

        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(profile))

        navigate(
          profile.platformRole === 'ADMIN' ? '/admin-dashboard' : '/profiles',
          { replace: true },
        )
      } catch {
        if (isMounted) {
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('user')
          setIsChecking(false)
        }
      }
    }

    checkAuthentication()
    return () => {
      isMounted = false
    }
  }, [navigate])

  return { isChecking }
}
