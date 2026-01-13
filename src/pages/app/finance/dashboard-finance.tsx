"use client"

import { Helmet } from "react-helmet-async"

import { useHeaderStore } from "@/hooks/use-header-store"
import { PendingPaymentsCard } from './components/pending-payments-card'
import { AverageTicketCard } from './components/average-ticket-card'
import { useEffect } from "react"
import { MonthlyRevenueCard } from "./components/monthly-revenue-card"
import { TransactionStatusOverview } from "./components/transaction-status-overview"
import { TransactionsValueChart } from "./components/transactions-value-chart"


export function DashboardFinance() {
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        setTitle('Dashboard Financeiro')
    }, [setTitle])

    return (
        <>
            <Helmet title="Dashboard Financeiro" />

            <div className="flex flex-col gap-5 mt-6 px-2 pb-8">

                <div className="flex justify-end">
                    {/* <DateRangePicker
                        onChange={handleRangeChange}
                    /> */}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <MonthlyRevenueCard revenue={0} />
                    <PendingPaymentsCard amount={0} />
                    <AverageTicketCard value={0} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <TransactionsValueChart />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TransactionStatusOverview />
            </div>
        </>
    )
}