import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { DashboardPeriodSelector } from '@/pages/app/dashboard/shared/components/dashboard-period-selector'
import {
  ADMIN_PERIODS,
  PERIOD_DAYS,
} from '@/pages/app/dashboard/shared/constants'
import type { DashboardPeriod } from '@/pages/app/dashboard/shared/types'
import './admin-dashboard-header.css'

interface AdminDashboardHeaderProps {
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
}

export function AdminDashboardHeader({
  period,
  onPeriodChange,
}: AdminDashboardHeaderProps) {
  const now = new Date()
  const start = subDays(now, PERIOD_DAYS[period])
  const interval = `${format(start, "d 'de' MMM", { locale: ptBR })} – ${format(now, "d 'de' MMM 'de' yyyy", { locale: ptBR })}`
  const lastUpdated = format(now, "d 'de' MMM 'às' HH:mm", { locale: ptBR })

  return (
    <div className="adb-header-root">
      <div>
        <span className="adb-header-label">Painel administrativo</span>
        <h1 className="adb-header-title">Visão executiva da plataforma</h1>
        <p className="adb-header-meta">
          {interval} · Atualizado em {lastUpdated}
        </p>
      </div>

      <DashboardPeriodSelector
        value={period}
        onChange={onPeriodChange}
        options={ADMIN_PERIODS}
      />
    </div>
  )
}
