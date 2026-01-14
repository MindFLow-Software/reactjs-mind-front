"use client"

import { useState, useEffect } from 'react'
import { Helmet } from "react-helmet-async"
import { subDays } from 'date-fns'

import { useHeaderStore } from "@/hooks/use-header-store"
import { TotalPsychologistsCard } from './components/total-psychologists-card'

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

            <div className="flex flex-col gap-5 mt-6 px-2 pb-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TotalPsychologistsCard />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                  
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                </div>
            </div>
        </>
    )
}