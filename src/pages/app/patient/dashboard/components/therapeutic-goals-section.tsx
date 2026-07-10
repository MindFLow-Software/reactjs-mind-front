import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardProgressBar } from '@/pages/app/dashboard/shared/components/dashboard-progress-bar'
import type { IDashboardGoal } from '@/pages/app/dashboard/shared/types'
import './therapeutic-goals-section.css'
import { Goal } from 'lucide-react'

export interface TherapeuticGoalsSectionProps {
  goals: IDashboardGoal[]
}

export function TherapeuticGoalsSection({
  goals,
}: TherapeuticGoalsSectionProps) {
  return (
    <Card className="ptd-goals-card">
      <CardHeader className="ptd-goals-header">
        <Goal size={20} className="text-teal-500" />
        <CardTitle className="ptd-goals-title">Metas terapêuticas</CardTitle>
      </CardHeader>

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
