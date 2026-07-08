import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '@/hooks/use-auth'
import { translatedHonorific } from '@/constants/translated-honorific'
import { DashboardPeriodSelector } from '@/pages/app/dashboard/shared/components/dashboard-period-selector'
import type { DashboardPeriod } from '../constants'
import { getGreeting } from '../helpers'
import { useTodayAppointments } from '../hooks/use-today-appointments'
import type { IPsychologistDashboardSummary } from '../types'
import './dashboard-header.css'

interface DashboardHeaderProps {
  period: DashboardPeriod
  onPeriodChange: (p: DashboardPeriod) => void
  summary: IPsychologistDashboardSummary
}

export function DashboardHeader({
  period,
  onPeriodChange,
  summary,
}: DashboardHeaderProps) {
  const { profile } = useAuth()
  const { count: appointmentCount } = useTodayAppointments()

  const formattedDate = useMemo(
    () => format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }),
    [],
  )

  const targetHonorific = profile?.psychologistProfile?.honorific
  const honorific = targetHonorific && translatedHonorific[targetHonorific]

  const fullName = profile ? `${profile?.firstName} ${profile?.lastName}` : ''
  const title = honorific ? `${honorific} ${fullName}` : fullName

  const summaryText = [
    `${summary.sessionsCompleted} sessões concluídas`,
    `${summary.weeklyOccupancyPercent}% de ocupação semanal`,
    `${summary.newPatients} novos pacientes`,
    `${summary.monthlyGoalProgressPercent}% da meta mensal`,
  ].join(' · ')

  return (
    <div className="dsh-header-root">
      <div>
        <h1 className="dsh-header-title">
          {getGreeting()}
          {`, ${title}`}
        </h1>
        <p className="dsh-header-date">
          {formattedDate}
          {appointmentCount > 0 &&
            ` · ${appointmentCount} ${appointmentCount === 1 ? 'sessão hoje' : 'sessões hoje'}`}
        </p>
        <p className="dsh-header-summary">{summaryText}</p>
      </div>

      <DashboardPeriodSelector value={period} onChange={onPeriodChange} />
    </div>
  )
}
