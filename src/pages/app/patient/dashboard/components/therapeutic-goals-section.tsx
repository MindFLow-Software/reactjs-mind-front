import { Card } from '@/components/ui/card'
import { DashboardProgressBar } from '@/pages/app/dashboard/shared/components/dashboard-progress-bar'
import type { IDashboardGoal } from '@/pages/app/dashboard/shared/types'
import './therapeutic-goals-section.css'

export interface TherapeuticGoalsSectionProps {
  goals: IDashboardGoal[]
}

export function TherapeuticGoalsSection({
  goals,
}: TherapeuticGoalsSectionProps) {
  return (
    <Card className="ptd-goals-card">
      <span className="ptd-goals-title">Metas terapêuticas</span>

      <div className="ptd-goals-list">
        {goals.map((goal) => (
          <DashboardProgressBar
            key={goal.key}
            label={goal.label}
            value={goal.value}
            target={goal.target}
            unit={goal.unit}
          />
        ))}
      </div>
    </Card>
  )
}
