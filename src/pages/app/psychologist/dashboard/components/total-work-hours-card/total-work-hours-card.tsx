import { memo } from 'react'
import { Clock } from 'lucide-react'
import { MetricCard } from '@/components/metric-card/metric-card'
import type { IDashboardGoal } from '@/types/dashboard/dashboard-goal'

type ITotalWorkHoursCard = {
  goal: IDashboardGoal
}

export const TotalWorkHoursCard = memo(function TotalWorkHoursCard({
  goal,
}: ITotalWorkHoursCard) {
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
