import { AlertCircle, RefreshCcw } from 'lucide-react'

import './dashboard-chart-error.css'

interface IEmptyChart {
  onRetry: () => void
}

export function DashboardChartError({ onRetry }: IEmptyChart) {
  return (
    <div className="dsh-error-state">
      <div className="dsh-error-state-icon bg-red-500/10 text-red-500">
        <AlertCircle className="size-6" />
      </div>
      <p className="dsh-error-state-label">
        Erro ao carregar dados
      </p>
      <button onClick={onRetry} className="dsh-error-retry-btn">
        <RefreshCcw size={12} /> Tentar novamente
      </button>
    </div>
  )
}
