import { useEffect } from 'react'
import { useRouteError, useNavigate } from 'react-router-dom'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CHUNK_ERROR_KEY = 'chunk_reload_attempted'

function isChunkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed') ||
    error.message.includes('Loading chunk')
  )
}

export function AppErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isChunkError(error)) return

    const alreadyAttempted = sessionStorage.getItem(CHUNK_ERROR_KEY)
    if (alreadyAttempted) return

    sessionStorage.setItem(CHUNK_ERROR_KEY, '1')
    window.location.reload()
  }, [error])

  const handleGoHome = () => {
    sessionStorage.removeItem(CHUNK_ERROR_KEY)
    navigate('/dashboard', { replace: true })
  }

  const handleReload = () => {
    sessionStorage.removeItem(CHUNK_ERROR_KEY)
    window.location.reload()
  }

  if (isChunkError(error)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="mx-auto max-w-md text-center flex flex-col gap-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
              <RotateCcw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-foreground">
              Atualizando o aplicativo…
            </h2>
            <p className="text-muted-foreground text-sm">
              Uma nova versão foi publicada. A página será recarregada
              automaticamente.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center flex flex-col gap-8">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-foreground">
            Algo deu errado
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Ocorreu um erro inesperado. Tente recarregar a página ou volte ao
            início.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={handleReload} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Recarregar
          </Button>
          <Button onClick={handleGoHome} className="gap-2">
            <Home className="h-4 w-4" />
            Ir para o início
          </Button>
        </div>
      </div>
    </div>
  )
}
