import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { subDays } from 'date-fns'

import { useHeaderStore } from '@/store/use-header-store'
import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'
import { DashboardHeader } from './components/dashboard-header'
import { PERIOD_DAYS } from './constants'
import { usePsychologistDashboard } from './hooks/use-psychologist-dashboard'
import { MonthPatientsAmountCard } from './components/month-patients-amount-card'
import { PatientsAmountCard } from './components/patients-amount-card'
import { TotalWorkHoursCard } from './components/total-work-hours-card'
import { TodayAgenda } from './components/today-agenda'
import { QuickActions } from './components/quick-actions'
import { SessionsBarChart } from './components/sessions-chart'
import { MonthlyGoalsSection } from './components/monthly-goals-section'
import { AttendanceSection } from './components/attendance-section'
import { InsightsSection } from './components/insights-section'
import { AnalyticsSection } from './components/analytics-section'
import './psychologist-dashboard.css'

export function PsychologistDashboard() {
  const { setTitle } = useHeaderStore()
  const { data, period, setPeriod } = usePsychologistDashboard()

  useEffect(() => {
    setTitle('Dashboard')
  }, [setTitle])

  const endDate = new Date()
  const startDate = subDays(endDate, PERIOD_DAYS[period])

  return (
    <>
      <Helmet title="Dashboard" />

      <div className="dsh-root">
        <DashboardHeader
          period={period}
          onPeriodChange={setPeriod}
          summary={data.summary}
        />

        <DashboardSection
          index="01"
          title="Visão geral"
          description="Indicadores principais do período"
        >
          <div className="dsh-overview-grid">
            <PatientsAmountCard />
            <MonthPatientsAmountCard startDate={startDate} endDate={endDate} />
            <TotalWorkHoursCard startDate={startDate} endDate={endDate} />
          </div>
        </DashboardSection>

        <DashboardSection
          index="02"
          title="Sessões"
          description="Volume de atendimentos e agenda próxima"
        >
          <div className="dsh-sessions-grid">
            <div className="dsh-sessions-grid-chart">
              <SessionsBarChart period={period} />
            </div>
            <TodayAgenda />
          </div>
        </DashboardSection>

        <DashboardSection
          index="03"
          title="Metas e comparecimento"
          description="Progresso mensal, presença e recomendações"
        >
          <div className="dsh-goals-content">
            <MonthlyGoalsSection goals={data.goals} />
            <div className="dsh-goals-section">
              <InsightsSection insights={data.insights} />
              <AttendanceSection attendance={data.attendance} />
            </div>
          </div>
        </DashboardSection>

        <DashboardSection
          index="04"
          title="Análise de pacientes"
          description="Perfil demográfico, ocupação e retenção"
        >
          <AnalyticsSection analytics={data.analytics} />
        </DashboardSection>

        <QuickActions />
      </div>
    </>
  )
}
