import { memo } from 'react'
import { CalendarCheck } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'

interface MonthPatientsAmountCardProps {
  sessionsCompleted: number
  growthPercent: number
}

export const MonthPatientsAmountCard = memo(function MonthPatientsAmountCard({
  sessionsCompleted,
  growthPercent,
}: MonthPatientsAmountCardProps) {
  return (
    <MetricCard variant="stacked" accentColor="violet">
      <MetricCard.Header
        icon={<CalendarCheck className="size-4 text-violet-500" />}
        label="Sessões no mês"
        accentColor="violet"
      />
      <MetricCard.Body>
        <MetricCard.Value>
          {sessionsCompleted.toLocaleString('pt-BR')}
        </MetricCard.Value>
        {growthPercent !== 0 && (
          <MetricCard.Trend
            direction={growthPercent > 0 ? 'up' : 'down'}
            label="vs. período anterior"
          >
            {growthPercent > 0 ? '+' : ''}
            {growthPercent}%
          </MetricCard.Trend>
        )}
      </MetricCard.Body>
    </MetricCard>
  )
})
