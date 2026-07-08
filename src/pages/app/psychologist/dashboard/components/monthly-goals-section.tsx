import { Target } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardProgressBar } from '@/pages/app/dashboard/shared/components/dashboard-progress-bar'
import type { IDashboardGoal } from '@/pages/app/dashboard/shared/types'
import './monthly-goals-section.css'

interface MonthlyGoalsSectionProps {
  goals: IDashboardGoal[]
}

export function MonthlyGoalsSection({ goals }: MonthlyGoalsSectionProps) {
  return (
    <Card className="dsh-goals-card">
      <CardHeader className="dsh-goals-header">
        <div className="dsh-goals-header-row">
          <div className="dsh-goals-icon">
            <Target className="size-4 text-blue-600" />
          </div>
          <CardTitle className="dsh-goals-title">Metas do mês</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="dsh-goals-content">
        {goals.map((goal) => (
          <DashboardProgressBar
            key={goal.key}
            label={goal.label}
            value={goal.value}
            target={goal.target}
            unit={goal.unit}
          />
        ))}
      </CardContent>
    </Card>
  )
}
