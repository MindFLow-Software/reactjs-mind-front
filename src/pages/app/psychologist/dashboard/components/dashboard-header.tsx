import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '@/hooks/use-auth'
import { translatedHonorific } from '@/constants/translated-honorific'
import { DashboardPeriodSelector } from '@/pages/app/dashboard/shared/components/dashboard-period-selector'
import type { IPsychologistDashboardData } from '@/types/dashboard'
import type { DashboardPeriod } from '../constants'
import { getGreeting } from '../helpers'
import './dashboard-header.css'

interface DashboardHeaderProps {
  periodControl: {
    period: DashboardPeriod
    onPeriodChange: (p: DashboardPeriod) => void
  }
  summary: IPsychologistDashboardData['summary']
  todayCount: number
}

export function DashboardHeader({
  periodControl: { period, onPeriodChange },
  summary,
  todayCount,
}: DashboardHeaderProps) {
  const { profile } = useAuth()

  const formattedDate = useMemo(
    () => format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }),
    [],
  )

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
