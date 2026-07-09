import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import { useHeaderStore } from '@/store/use-header-store'
import { useAdminDashboard } from './hooks/use-admin-dashboard'

import { GrowthSection } from './components/growth-section'
import { AdminDashboardHeader } from './components/admin-dashboard-header'
import { SessionsActivitySection } from './components/sessions-activity-section'
import { ExecutiveOverviewSection } from './components/executive-overview-section'
import { PatientsAnalyticsSection } from './components/patients-analytics-section'
import { OperationalInsightsSection } from './components/operational-insights-section'
import { RevenueSubscriptionsSection } from './components/revenue-subscriptions-section'
import { PsychologistsAnalyticsSection } from './components/psychologists-analytics-section'

import './admin-dashboard.css'

export function AdminDashboard() {
  const { setTitle } = useHeaderStore()
  const { data, period, setPeriod } = useAdminDashboard()

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
          isError={data.executive.isError}
          isLoading={data.executive.isLoading}
        />

        <GrowthSection
          period={period}
          growth={data.growth}
          onPeriodChange={setPeriod}
          isError={data.growth.isError}
          isLoading={data.growth.isLoading}
        />

        <RevenueSubscriptionsSection revenue={data.revenue} />

        <SessionsActivitySection activity={data.activity} />

        <PsychologistsAnalyticsSection psychologists={data.psychologists} />

        <PatientsAnalyticsSection
          patients={data.patients}
          isError={data.patients.isError}
          isLoading={data.patients.isLoading}
        />

        <OperationalInsightsSection insights={data.insights} />
      </div>
    </>
  )
}
