"use client"

import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { subDays } from "date-fns"

import { useHeaderStore } from "@/hooks/use-header-store"
import { PatientsAmountCard } from "@/pages/app/reports/components/patients-amount-card"
import { MonthPatientsAmountCard } from "@/pages/app/reports/components/month-patients-amount-card"
import { TotalWorkHoursCard } from "@/pages/app/reports/components/total-work-hours-card"
import { NewPatientsBarChart } from "@/pages/app/reports/components/patients-amount-bar-chart"
import { SessionsBarChart } from "@/pages/app/reports/components/sessions-chart"
import { PatientsByAgeChart } from "@/pages/app/reports/components/patients-by-age-chart"
import { PatientsByGenderChart } from "@/pages/app/reports/components/patients-by-gender-chart"

interface DateRange {
    from: Date | undefined
    to: Date | undefined
}

const getInitialRange = (): DateRange => {
    const today = new Date()
    const thirtyDaysAgo = subDays(today, 30)
    return { from: thirtyDaysAgo, to: today }
}

export function ReportsPage() {
    const { setTitle } = useHeaderStore()

    const [dateRange] = useState<DateRange>(getInitialRange)
    const { from: startDate, to: endDate } = dateRange

    useEffect(() => {
        setTitle("Painel Operacional")
    }, [setTitle])

    return (
        <>
            <Helmet title="Painel Operacional" />

            <div className="flex flex-col gap-4">

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <PatientsAmountCard />
                    <MonthPatientsAmountCard startDate={startDate} endDate={endDate} />
                    <TotalWorkHoursCard startDate={startDate} endDate={endDate} />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                    <NewPatientsBarChart endDate={endDate} />
                    <SessionsBarChart endDate={endDate} />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <PatientsByAgeChart endDate={endDate} />
                    <PatientsByGenderChart endDate={endDate} />
                </div>
            </div>
        </>
    )
}
