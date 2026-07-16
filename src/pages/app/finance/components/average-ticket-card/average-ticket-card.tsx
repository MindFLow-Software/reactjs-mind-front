'use client'

import { BarChartHorizontal } from 'lucide-react'
import { Currency } from '@/utils/currency'
import { FinanceStatCard } from '../finance-stat-card/finance-stat-card'

type AverageTicketCardProps = {
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
    value={Currency.formatBRL(value)}
    suffix="por sessão"
  />
)
