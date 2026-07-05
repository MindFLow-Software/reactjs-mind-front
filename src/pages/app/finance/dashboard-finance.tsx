'use client'

import { Helmet } from 'react-helmet-async'

import { useHeaderStore } from '@/store/use-header-store'
import { PendingPaymentsCard } from './components/pending-payments-card'
import { AverageTicketCard } from './components/average-ticket-card'
import { useEffect } from 'react'
import { MonthlyRevenueCard } from './components/monthly-revenue-card'
import { TransactionStatusOverview } from './components/transaction-status-overview'
import { TransactionsValueChart } from './components/transactions-value-chart'
import './dashboard-finance.css'

export function DashboardFinance() {
  const { setTitle } = useHeaderStore()

  useEffect(() => {
    setTitle('Dashboard Financeiro')
  }, [setTitle])

  return (
    <>
      <Helmet title="Dashboard Financeiro" />

      <div className="fin-dashboard-root">
        <div className="fin-dashboard-toolbar" />

        <div className="fin-dashboard-stats-grid">
          <MonthlyRevenueCard revenue={0} />
          <PendingPaymentsCard amount={0} />
          <AverageTicketCard value={0} />
        </div>
      </div>

      <div className="fin-dashboard-charts-grid">
        <TransactionsValueChart />
      </div>

      <div className="fin-dashboard-charts-grid--2col">
        <TransactionStatusOverview />
      </div>
    </>
  )
}
