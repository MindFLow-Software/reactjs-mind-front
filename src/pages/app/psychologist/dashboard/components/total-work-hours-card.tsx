import { memo } from 'react'
import { Clock } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'
import type { IDashboardGoal } from '@/types/dashboard'

interface TotalWorkHoursCardProps {
  goal: IDashboardGoal
}

export const TotalWorkHoursCard = memo(function TotalWorkHoursCard({
  goal,
}: TotalWorkHoursCardProps) {
  const atGoal = goal.percent >= 100

  return (
    <MetricCard variant="stacked" accentColor="emerald">
      <MetricCard.Header
        icon={<Clock className="size-4 text-emerald-500" />}
        label="Horas atendidas"
        accentColor="emerald"
      />
      <MetricCard.Body>
        <MetricCard.Value>{goal.current}h</MetricCard.Value>
        <MetricCard.Progress
          value={goal.percent}
          atGoal={atGoal}
          label={`meta mensal: ${goal.target}h`}
        />
      </MetricCard.Body>
    </MetricCard>
  )
})
