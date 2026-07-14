import { Loader2 } from 'lucide-react'

import './dashboard-chart-loader.css'

export function DashboardChartLoader() {
  return (
    <div className="dsh-loader-container">
      <Loader2 className="dsh-loader-icon" />
    </div>
  )
}
