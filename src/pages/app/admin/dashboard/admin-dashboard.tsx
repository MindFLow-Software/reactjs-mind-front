import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import { useHeaderStore } from '@/store/use-header-store'
import { AdminDashboardHeader } from './components/admin-dashboard-header'
import { useAdminDashboard } from './hooks/use-admin-dashboard'
import { ExecutiveOverviewSection } from './components/executive-overview-section'
import { GrowthSection } from './components/growth-section'
import { RevenueSubscriptionsSection } from './components/revenue-subscriptions-section'
import { SessionsActivitySection } from './components/sessions-activity-section'
import { PsychologistsAnalyticsSection } from './components/psychologists-analytics-section'
import { PatientsAnalyticsSection } from './components/patients-analytics-section'
import { OperationalInsightsSection } from './components/operational-insights-section'
import './admin-dashboard.css'

export function AdminDashboard() {
  const { setTitle } = useHeaderStore()
  const { data, isLoading, isError, period, setPeriod } = useAdminDashboard()

  useEffect(() => {
    setTitle('Dashboard do Admin')
  }, [setTitle])

  return (
    <>
      <Helmet title="Dashboard do Admin" />

      <div className="adb-dashboard-root">
        <AdminDashboardHeader period={period} onPeriodChange={setPeriod} />

        <ExecutiveOverviewSection
          executive={data.executive}
          isLoading={isLoading}
          isError={isError}
        />

        <GrowthSection
          growth={data.growth}
          period={period}
          onPeriodChange={setPeriod}
          isLoading={isLoading}
          isError={isError}
        />

        <RevenueSubscriptionsSection revenue={data.revenue} />

        <SessionsActivitySection activity={data.activity} />

        <PsychologistsAnalyticsSection psychologists={data.psychologists} />

        <PatientsAnalyticsSection
          patients={data.patients}
          isLoading={isLoading}
          isError={isError}
        />

        <OperationalInsightsSection insights={data.insights} />
      </div>
    </>
  )
}
