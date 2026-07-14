import type { ReactNode } from 'react'

import './dashboard-chart-empty.css'

interface IDashboardChartEmpty {
  icon: ReactNode
  title: string
  subtitle: string
}

export function DashboardChartEmpty({
  icon,
  title,
  subtitle,
}: IDashboardChartEmpty) {
  return (
    <div className="dsh-empty-state">
      <div className="dsh-empty-state-icon">{icon}</div>
      <p className="dsh-empty-state-title">{title}</p>
      <p className="dsh-empty-state-subtitle">
        {subtitle}
      </p>
    </div>
  )
}
