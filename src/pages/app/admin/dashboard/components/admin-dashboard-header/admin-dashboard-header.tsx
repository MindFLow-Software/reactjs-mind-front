import { DashboardPeriodSelector } from '@/pages/app/dashboard/shared/components/dashboard-period-selector/dashboard-period-selector'
import {
  ADMIN_PERIODS,
  PERIOD_DAYS,
} from '@/pages/app/dashboard/shared/constants'
import type { IDashboardPeriod } from '@/pages/app/dashboard/shared/types'
import { Time } from '@/utils/time'

import './admin-dashboard-header.css'

type IAdminDashboardHeader = {
  period: IDashboardPeriod
  onPeriodChange: (period: IDashboardPeriod) => void
}

export function AdminDashboardHeader({
  period,
  onPeriodChange,
}: IAdminDashboardHeader) {
  const now = new Date()
  const start = Time.subtractDays(now, PERIOD_DAYS[period])
  const interval = `${Time.toDayShortMonth(start)} – ${Time.toDayShortMonthYear(now)}`
  const lastUpdated = Time.toDayShortMonthAtTime(now)

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
