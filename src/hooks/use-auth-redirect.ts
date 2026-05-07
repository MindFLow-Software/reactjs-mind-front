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
        const response = await api.get('/psychologist/me')
        const psychologist = response.data?.psychologist

        if (!isMounted) return

        if (psychologist) {
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('user', JSON.stringify(psychologist))
        }

        const roleValue = typeof psychologist?.role === 'object' && psychologist?.role !== null
          ? psychologist.role.name
          : psychologist?.role
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
