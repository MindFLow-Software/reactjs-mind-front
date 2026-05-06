"use client"

import { useState, useEffect, lazy, Suspense } from 'react'
import { Helmet } from "react-helmet-async"
import { subDays } from 'date-fns'

import { useHeaderStore } from "@/hooks/use-header-store"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "./components/dashboard-header"
import type { DashboardPeriod } from "./components/dashboard-header"
import { MonthPatientsAmountCard } from "./components/month-patients-amount-card"
import { PatientsAmountCard } from "./components/patients-amount-card"
import { TotalWorkHoursCard } from "./components/total-work-hours-card"
import { TodayAgenda } from "./components/today-agenda"
import { QuickActions } from "./components/quick-actions"

const SessionsBarChart = lazy(() =>
    import('./components/sessions-chart').then(m => ({ default: m.SessionsBarChart }))
)
const PatientsByAgeChart = lazy(() =>
    import('./components/patients-by-age-chart').then(m => ({ default: m.PatientsByAgeChart }))
)
const PatientsByGenderChart = lazy(() =>
    import('./components/patients-by-gender-chart').then(m => ({ default: m.PatientsByGenderChart }))
)

const PERIOD_DAYS: Record<DashboardPeriod, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    'year': 365,
}

function ChartSkeleton({ height = 300 }: { height?: number }) {
    return <Skeleton className="w-full rounded-2xl" style={{ height }} />
}

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
                {/* Header com saudação e seletor de período */}
                <DashboardHeader period={period} onPeriodChange={setPeriod} />

                {/* Cards de métricas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <PatientsAmountCard />
                    <MonthPatientsAmountCard startDate={startDate} endDate={endDate} />
                    <TotalWorkHoursCard startDate={startDate} endDate={endDate} />
                </div>

                {/* Volume de sessões + Agenda de hoje */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
                    <Suspense fallback={<ChartSkeleton height={360} />}>
                        <SessionsBarChart period={period} />
                    </Suspense>
                    <TodayAgenda />
                </div>

                {/* Faixa etária + Perfil gênero + Ações rápidas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Suspense fallback={<ChartSkeleton height={280} />}>
                        <PatientsByAgeChart period={period} />
                    </Suspense>
                    <Suspense fallback={<ChartSkeleton height={280} />}>
                        <PatientsByGenderChart period={period} />
                    </Suspense>
                    <QuickActions />
                </div>
            </div>
        </>
    )
}
