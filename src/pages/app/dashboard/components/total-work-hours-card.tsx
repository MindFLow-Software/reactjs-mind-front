import { memo } from 'react'
import { Clock } from 'lucide-react'
import { useWorkHours } from '../hooks/use-work-hours'
import { MONTHLY_GOAL_HOURS } from '../constants'
import { formatTime } from '../helpers'
import { MetricCard } from './metric-card'

interface TotalWorkHoursCardProps {
  startDate?: Date
  endDate?: Date
}

export const TotalWorkHoursCard = memo(function TotalWorkHoursCard({
  startDate,
  endDate,
}: TotalWorkHoursCardProps) {
  const { totalMinutes, progressPct, atGoal, isLoading, isError } =
    useWorkHours({ startDate, endDate })

  return (
    <MetricCard
      accentColor="emerald"
      header={{
        label: 'Horas atendidas',
        icon: <Clock className="size-4 text-emerald-500" />,
      }}
      state={{ isLoading, isError }}
    >
      <MetricCard.Value>
        {totalMinutes > 0 ? formatTime(totalMinutes) : '0h'}
      </MetricCard.Value>
      <MetricCard.Progress
        value={progressPct}
        atGoal={atGoal}
        label={`meta mensal: ${MONTHLY_GOAL_HOURS}h`}
      />
    </MetricCard>
  )
})
