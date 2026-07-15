import { AlertCircle, RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'

import './dashboard-error-state.css'

type IDashboardErrorState = {
  message?: string
  onRetry: () => void
}

export function DashboardErrorState({
  message = 'Erro ao carregar dados',
  onRetry,
}: IDashboardErrorState) {
  return (
    <div className="dsh-page-error-root">
      <AlertCircle className="dsh-page-error-icon" />
      <p className="dsh-page-error-message">{message}</p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        <RefreshCcw className="size-3.5" />
        Tentar novamente
      </Button>
    </div>
  )
}
