'use client'

import { AlertCircle } from 'lucide-react'
import { formatCurrency } from '../helpers'
import { FinanceStatCard } from './finance-stat-card'

interface PendingPaymentsCardProps {
  amount: number
}

export const PendingPaymentsCard = ({
  amount = 0,
}: PendingPaymentsCardProps) => (
  <FinanceStatCard
    icon={<AlertCircle className="size-4" />}
    accent="amber"
    header={{
      title: 'A Receber',
      subtitle: 'Pagamentos pendentes',
    }}
    value={formatCurrency(amount)}
  />
)
