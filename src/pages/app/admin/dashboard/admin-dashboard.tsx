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
import { DashboardSkeleton } from '@/pages/app/dashboard/shared/components/dashboard-skeleton/dashboard-skeleton'
import { DashboardErrorState } from '@/pages/app/dashboard/shared/components/dashboard-error-state/dashboard-error-state'

import './admin-dashboard.css'

export function AdminDashboard() {
  const { setTitle } = useHeaderStore()
  const { data, isLoading, isError, refetch, period, setPeriod } =
    useAdminDashboard()

  useEffect(() => {
    setTitle('Dashboard do Admin')
  }, [setTitle])

  return (
    <>
      <Helmet title="Dashboard do Admin" />

      <div className="adb-dashboard-root">
        <AdminDashboardHeader period={period} onPeriodChange={setPeriod} />

        {isLoading ? (
          <DashboardSkeleton variant="page" />
        ) : isError || !data ? (
          <DashboardErrorState onRetry={refetch} />
        ) : (
          <>
            <ExecutiveOverviewSection executive={data.executive} />

            <GrowthSection
              period={period}
              growth={data.growth}
              onPeriodChange={setPeriod}
            />

            <RevenueSubscriptionsSection revenue={data.revenue} />

            <SessionsActivitySection activity={data.activity} />

            <PsychologistsAnalyticsSection psychologists={data.psychologists} />

            <PatientsAnalyticsSection patients={data.patients} />

            <OperationalInsightsSection insights={data.insights} />
          </>
        )}
      </div>
    </>
  )
}
