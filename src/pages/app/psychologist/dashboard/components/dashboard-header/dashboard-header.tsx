import { useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { translatedHonorific } from '@/constants/translated-honorific'
import { DashboardPeriodSelector } from '@/pages/app/dashboard/shared/components/dashboard-period-selector/dashboard-period-selector'
import type { IPsychologistDashboardData } from '@/types/dashboard/psychologist-dashboard-data'
import type { IDashboardPeriod } from '@/pages/app/dashboard/shared/types'
import { getGreeting } from '@/pages/app/dashboard/shared/helpers'
import { Time } from '@/utils/time'
import './dashboard-header.css'

type IDashboardHeader = {
  periodControl: {
    period: IDashboardPeriod
    onPeriodChange: (period: IDashboardPeriod) => void
  }
  summary: IPsychologistDashboardData['summary']
  todayCount: number
}

export function DashboardHeader({
  periodControl: { period, onPeriodChange },
  summary,
  todayCount,
}: IDashboardHeader) {
  const { profile } = useAuth()

  const formattedDate = useMemo(() => Time.toWeekdayLongDate(new Date()), [])

  const targetHonorific = profile?.psychologistProfile?.honorific
  const honorific = targetHonorific && translatedHonorific[targetHonorific]

  const fullName = profile ? `${profile?.firstName} ${profile?.lastName}` : ''
  const title = honorific ? `${honorific} ${fullName}` : fullName

  return (
    <div className="dsh-header-root">
      <div>
        <h1 className="dsh-header-title">
          {getGreeting()}
          {`, ${title}`}
        </h1>
        <p className="dsh-header-date">
          {formattedDate}
          {todayCount > 0 &&
            ` · ${todayCount} ${todayCount === 1 ? 'sessão hoje' : 'sessões hoje'}`}
        </p>
        <p className="dsh-header-summary">
          <span className="font-medium">{`${summary.sessionsCompleted} sessões concluídas`}</span>
          <span>{' · '}</span>
          <span className="font-medium text-green-500">{`${summary.weeklyOccupancyPercent}% de ocupação semanal`}</span>
          <span>{' · '}</span>
          <span className="font-medium text-violet-400">{`${summary.newPatients} novos pacientes`}</span>
          <span>{' · '}</span>
          <span className="font-medium">{`${summary.monthlyGoalProgressPercent}% da meta mensal concluída`}</span>
        </p>
      </div>

      <DashboardPeriodSelector value={period} onChange={onPeriodChange} />
    </div>
  )
}
