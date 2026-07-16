'use client'

import { DollarSign } from 'lucide-react'
import { Currency } from '@/utils/currency'
import { FinanceStatCard } from '../finance-stat-card/finance-stat-card'

type MonthlyRevenueCardProps = {
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
    value={Currency.formatBRL(revenue)}
  />
)
