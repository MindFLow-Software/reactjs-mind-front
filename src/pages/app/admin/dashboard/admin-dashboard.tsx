'use client'

import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { subDays } from 'date-fns'

import { useHeaderStore } from '@/store/use-header-store'
import { TotalPsychologistsCard } from './components/total-psychologists-card'
import { TotalPatientCard } from './components/total-patient-card'
import { TotalSuggestionsCard } from './components/total-suggestions-card'
import { NewPsychologistsBarChart } from './components/new-psychologists-bar-chart'
import { NewPatientsBarChart } from './components/new-patient-bar-chart'
import { PsychologistsAgeRangeChart } from './components/psychologists-by-age-chart'
import { PsychologistsGenderChart } from './components/psychologists-by-gender-chart'
import './admin-dashboard.css'

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

const getInitialRange = (): DateRange => {
  const today = new Date()
  const thirtyDaysAgo = subDays(today, 30)
  return { from: thirtyDaysAgo, to: today }
}

export function AdminDashboard() {
  const { setTitle } = useHeaderStore()

  const [dateRange] = useState<DateRange>(getInitialRange)
  const { to: endDate } = dateRange

  useEffect(() => {
    setTitle('Dashboard do Admin')
  }, [setTitle])

  return (
    <>
      <Helmet title="Dashboard do Admin" />

      <div className="adb-dashboard-root">
        <div className="adb-dashboard-stats-grid">
          <TotalPsychologistsCard />
          <TotalPatientCard />
          <TotalSuggestionsCard />
        </div>

        <div className="adb-dashboard-charts-grid">
          <NewPsychologistsBarChart endDate={endDate} />
          <NewPatientsBarChart endDate={endDate} />
        </div>

        <div className="adb-dashboard-charts-grid--2col">
          <PsychologistsAgeRangeChart />
          <PsychologistsGenderChart endDate={endDate} />
        </div>
      </div>
    </>
  )
}
