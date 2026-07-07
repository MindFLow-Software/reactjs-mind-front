'use client'

import { BarChartHorizontal } from 'lucide-react'
import { formatCurrency } from '../helpers'
import { FinanceStatCard } from './finance-stat-card'

interface AverageTicketCardProps {
  value: number
}

export const AverageTicketCard = ({ value = 0 }: AverageTicketCardProps) => (
  <FinanceStatCard
    icon={<BarChartHorizontal className="size-4" />}
    accent="indigo"
    header={{
      title: 'Ticket Médio',
      subtitle: 'Valor médio por atendimento',
    }}
    value={formatCurrency(value)}
    suffix="por sessão"
  />
)
