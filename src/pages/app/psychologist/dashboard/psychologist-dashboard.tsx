import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import { useHeaderStore } from '@/store/use-header-store'
import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section/dashboard-section'
import { DashboardSkeleton } from '@/pages/app/dashboard/shared/components/dashboard-skeleton/dashboard-skeleton'
import { DashboardErrorState } from '@/pages/app/dashboard/shared/components/dashboard-error-state/dashboard-error-state'
import { DashboardHeader } from './components/dashboard-header'
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
  const { data, isLoading, isError, refetch, period, setPeriod } =
    usePsychologistDashboard()

  useEffect(() => {
    setTitle('Dashboard')
  }, [setTitle])

  const [, hoursGoal, activePatientsGoal] = data?.goals ?? []

  return (
    <>
      <Helmet title="Dashboard" />

      <div className="dsh-root">
        {isLoading ? (
          <DashboardSkeleton variant="page" />
        ) : isError || !data ? (
          <DashboardErrorState onRetry={refetch} />
        ) : (
          <>
            <DashboardHeader
              periodControl={{ period, onPeriodChange: setPeriod }}
              summary={data.summary}
              todayCount={data.agenda.today.length}
            />

            <DashboardSection
              header={{
                index: '01',
                title: 'Visão geral',
                description: 'Indicadores principais do período',
              }}
            >
              <div className="dsh-overview-grid">
                {activePatientsGoal && (
                  <PatientsAmountCard goal={activePatientsGoal} />
                )}
                <MonthPatientsAmountCard
                  sessionsCompleted={data.summary.sessionsCompleted}
                  growthPercent={data.sessionsStats.growthPercent}
                />
                {hoursGoal && <TotalWorkHoursCard goal={hoursGoal} />}
              </div>
            </DashboardSection>

            <DashboardSection
              header={{
                index: '02',
                title: 'Sessões',
                description: 'Volume de atendimentos e agenda próxima',
              }}
            >
              <div className="dsh-sessions-grid">
                <div className="dsh-sessions-grid-chart">
                  <SessionsBarChart
                    period={period}
                    sessionsVolume={data.sessionsVolume}
                    sessionsStats={data.sessionsStats}
                  />
                </div>
                <TodayAgenda
                  today={data.agenda.today}
                  tomorrow={data.agenda.tomorrow}
                />
              </div>
            </DashboardSection>

            <DashboardSection
              header={{
                index: '03',
                title: 'Metas e comparecimento',
                description: 'Progresso mensal, presença e recomendações',
              }}
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
              header={{
                index: '04',
                title: 'Análise de pacientes',
                description: 'Perfil demográfico, ocupação e retenção',
              }}
            >
              <AnalyticsSection analytics={data.analytics} />
            </DashboardSection>
          </>
        )}

        <QuickActions />
      </div>
    </>
  )
}
