"use client"

import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useHeaderStore } from "@/hooks/use-header-store"
import { AgendaTodayWidget } from "./components/agenda-today-widget"
import { FinanceSummaryWidget } from "./components/finance-summary-widget"
import { PendingEvolutionsWidget } from "./components/pending-evolutions-widget"

export function Dashboard() {
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        setTitle('Dashboard')
    }, [setTitle])


    return (
        <>
            <Helmet title="Dashboard" />

            <div className="flex flex-col gap-4">

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <AgendaTodayWidget />
                    <PendingEvolutionsWidget />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                    <FinanceSummaryWidget />
                </div>

            </div>
        </>
    )
}
