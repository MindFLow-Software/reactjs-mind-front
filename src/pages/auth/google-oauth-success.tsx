import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { getProfile } from "@/api/get-profile"

export function GoogleOAuthSuccess() {
  const navigate = useNavigate()
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    async function finishLogin() {
      try {
        const profile = await getProfile()

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("user", JSON.stringify(profile))

        navigate("/dashboard", { replace: true })
      } catch {
        toast.error("Não foi possível completar o login. Tente novamente.")
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
