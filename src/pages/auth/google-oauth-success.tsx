import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { getProfile } from "@/api/get-profile"
import { api } from "@/lib/axios"

export function GoogleOAuthSuccess() {
  const navigate = useNavigate()
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    async function finishLogin() {
      try {
        const wait = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms))

        const fetchProfileWithRetry = async () => {
          let lastError: unknown

          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              return await getProfile()
            } catch (error) {
              lastError = error
              await wait(250 * (attempt + 1))
            }
          }

          throw lastError
        }

        let profile

        try {
          profile = await fetchProfileWithRetry()
        } catch {
          await api.post("/session/refresh")
          profile = await fetchProfileWithRetry()
        }

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("user", JSON.stringify(profile))
        navigate("/dashboard", { replace: true })
      } catch (error: any) {
        const status = error?.response?.status

        if (status === 400 || status === 404) {
          navigate("/complete-registration", { replace: true })
          return
        }

        toast.error("Nao foi possivel completar o login. Tente novamente.")
        navigate("/sign-in", { replace: true })
      }
    }

    finishLogin()
  }, [navigate])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
        <p className="text-sm text-muted-foreground">Finalizando login...</p>
      </div>
    </div>
  )
}
