import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/axios"

export function useAuthRedirect(): { isChecking: boolean } {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkAuthentication() {
      try {
        const response = await api.get('/me')
        const user = response.data?.user

        if (!isMounted) return

        if (user) {
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('user', JSON.stringify(user))
        }

        const roleValue = typeof user?.role === 'object' && user?.role !== null
          ? user.role.name
          : user?.role
        const role = String(roleValue ?? '').trim().toUpperCase()

        navigate(role === 'SUPER_ADMIN' ? '/admin-dashboard' : '/dashboard', { replace: true })
      } catch {
        if (isMounted) {
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('user')
          setIsChecking(false)
        }
      }
    }

    checkAuthentication()
    return () => { isMounted = false }
  }, [navigate])

  return { isChecking }
}
