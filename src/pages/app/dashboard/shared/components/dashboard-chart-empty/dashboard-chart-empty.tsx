import type { ReactNode } from 'react'

import './dashboard-chart-empty.css'

type IDashboardChartEmpty = {
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
    <div className="dsh-chart-empty-root">
      <div className="dsh-chart-empty-icon">{icon}</div>
      <p className="dsh-chart-empty-title">{title}</p>
      <p className="dsh-chart-empty-subtitle">{subtitle}</p>
    </div>
  )
}
