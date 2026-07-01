import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { subDays } from 'date-fns'

import { useHeaderStore } from '@/store/use-header-store'
import { DashboardHeader } from './components/dashboard-header'
import { type DashboardPeriod, PERIOD_DAYS } from './constants'
import { MonthPatientsAmountCard } from './components/month-patients-amount-card'
import { PatientsAmountCard } from './components/patients-amount-card'
import { TotalWorkHoursCard } from './components/total-work-hours-card'
import { TodayAgenda } from './components/today-agenda'
import { QuickActions } from './components/quick-actions'
import { SessionsBarChart } from './components/sessions-chart'
import { PatientsByAgeChart } from './components/patients-by-age-chart'
import { PatientsByGenderChart } from './components/patients-by-gender-chart'

export function Dashboard() {
  const { setTitle } = useHeaderStore()
  const [period, setPeriod] = useState<DashboardPeriod>('30d')

  useEffect(() => {
    setTitle('Dashboard')
  }, [setTitle])

  const endDate = new Date()
  const startDate = subDays(endDate, PERIOD_DAYS[period])

  return (
    <>
      <Helmet title="Dashboard" />

      <div className="flex flex-col gap-5">
        <DashboardHeader period={period} onPeriodChange={setPeriod} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <PatientsAmountCard />
          <MonthPatientsAmountCard startDate={startDate} endDate={endDate} />
          <TotalWorkHoursCard startDate={startDate} endDate={endDate} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <SessionsBarChart period={period} />
          </div>
          <TodayAgenda />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PatientsByAgeChart />
          <PatientsByGenderChart />
          <QuickActions />
        </div>
      </div>
    </>
  )
}
