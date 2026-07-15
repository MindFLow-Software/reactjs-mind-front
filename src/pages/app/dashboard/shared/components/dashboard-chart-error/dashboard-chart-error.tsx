import { AlertCircle, RefreshCcw } from 'lucide-react'

import './dashboard-chart-error.css'

type IDashboardChartError = {
  onRetry: () => void
}

export function DashboardChartError({ onRetry }: IDashboardChartError) {
  return (
    <div className="dsh-chart-error-root">
      <div className="dsh-chart-error-icon">
        <AlertCircle className="size-6" />
      </div>
      <p className="dsh-chart-error-label">Erro ao carregar dados</p>
      <button onClick={onRetry} className="dsh-chart-error-retry-btn">
        <RefreshCcw size={12} /> Tentar novamente
      </button>
    </div>
  )
}
