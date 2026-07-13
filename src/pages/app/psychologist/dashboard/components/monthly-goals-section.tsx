import { Target } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DashboardProgressBar } from '@/pages/app/dashboard/shared/components/dashboard-progress-bar'
import type { IDashboardGoal } from '@/types/dashboard'
import './monthly-goals-section.css'

interface MonthlyGoalsSectionProps {
  goals: IDashboardGoal[]
}

export function MonthlyGoalsSection({ goals }: MonthlyGoalsSectionProps) {
  return (
    <Card className="dsh-goals-card">
      <CardHeader className="dsh-goals-header">
        <div className="dsh-goals-icon">
          <Target className="size-4 text-blue-600" />
        </div>
        <div>
          <CardTitle className="dsh-goals-title">Metas do mês</CardTitle>
          <CardDescription>
            Acompanhe seu progresso em direção ao objetivo definido
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-evenly gap-4">
        {goals.map((goal) => (
          <DashboardProgressBar
            key={goal.label}
            label={goal.label}
            value={goal.current}
            target={goal.target}
          />
        ))}
      </CardContent>
    </Card>
  )
}
