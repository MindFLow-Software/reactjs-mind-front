import { memo } from 'react'
import { CalendarCheck } from 'lucide-react'
import { useSessionsCount } from '../hooks/use-sessions-count'
import { MetricCard } from './metric-card'

interface MonthPatientsAmountCardProps {
  startDate: Date | undefined
  endDate: Date | undefined
}

export const MonthPatientsAmountCard = memo(function MonthPatientsAmountCard({
  startDate,
  endDate,
}: MonthPatientsAmountCardProps) {
  const { count, pct, isPositive, isLoading, isError, refetch } =
    useSessionsCount({ startDate, endDate })

  return (
    <MetricCard
      accentColor="violet"
      header={{ label: 'Sessões no mês', icon: <CalendarCheck className="size-4 text-violet-500" /> }}
      state={{ isLoading, isError, onRetry: refetch }}
    >
      <MetricCard.Value>{count.toLocaleString('pt-BR')}</MetricCard.Value>
      {pct !== null && (
        <MetricCard.Trend
          direction={isPositive ? 'up' : 'down'}
          label="vs. mês anterior"
        >
          {isPositive ? '+' : '-'}
          {pct}%
        </MetricCard.Trend>
      )}
    </MetricCard>
  )
})
