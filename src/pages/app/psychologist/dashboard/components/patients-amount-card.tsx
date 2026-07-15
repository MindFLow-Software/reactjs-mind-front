import { memo } from 'react'
import { Users } from 'lucide-react'
import { MetricCard } from '@/components/metric-card/metric-card'
import type { IDashboardGoal } from '@/types/dashboard/dashboard-goal'

interface PatientsAmountCardProps {
  goal: IDashboardGoal
}

export const PatientsAmountCard = memo(function PatientsAmountCard({
  goal,
}: PatientsAmountCardProps) {
  return (
    <MetricCard variant="stacked" accentColor="blue">
      <MetricCard.Header
        icon={<Users className="size-4 text-blue-500" />}
        label="Pacientes ativos"
        accentColor="blue"
      />
      <MetricCard.Body>
        <MetricCard.Value>
          {goal.current.toLocaleString('pt-BR')}
        </MetricCard.Value>
        {goal.target > 0 && (
          <MetricCard.Trend
            direction={goal.percent >= 100 ? 'up' : 'neutral'}
            label="da meta mensal"
          >
            {goal.percent}%
          </MetricCard.Trend>
        )}
      </MetricCard.Body>
    </MetricCard>
  )
})
