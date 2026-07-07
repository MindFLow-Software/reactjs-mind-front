'use client'

import { DollarSign } from 'lucide-react'
import { formatCurrency } from '../helpers'
import { FinanceStatCard } from './finance-stat-card'

interface MonthlyRevenueCardProps {
  revenue: number
}

export const MonthlyRevenueCard = ({
  revenue = 0,
}: MonthlyRevenueCardProps) => (
  <FinanceStatCard
    icon={<DollarSign className="size-4" />}
    accent="green"
    header={{
      title: 'Receita Total',
      subtitle: 'Faturamento bruto mensal',
    }}
    value={formatCurrency(revenue)}
  />
)
