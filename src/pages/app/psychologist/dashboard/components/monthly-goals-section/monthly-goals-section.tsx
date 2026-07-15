import { Target } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IconBadge, IconBadgeTone } from '@/components/icon-badge/icon-badge'
import { DashboardProgressBar } from '@/pages/app/dashboard/shared/components/dashboard-progress-bar/dashboard-progress-bar'
import type { IDashboardGoal } from '@/types/dashboard/dashboard-goal'
import { EditGoalsDialog } from '../edit-goals-dialog/edit-goals-dialog'
import './monthly-goals-section.css'

type IMonthlyGoalsSection = {
  goals: IDashboardGoal[]
}

export function MonthlyGoalsSection({ goals }: IMonthlyGoalsSection) {
  const [sessionsGoal, hoursGoal, activePatientsGoal] = goals

  return (
    <Card className="dsh-goals-card">
      <CardHeader className="dsh-goals-header">
        <IconBadge tone={IconBadgeTone.BLUE}>
          <Target className="size-4" />
        </IconBadge>
        <div className="flex-1">
          <CardTitle className="dsh-goals-title">Metas do mês</CardTitle>
          <CardDescription>
            Acompanhe seu progresso em direção ao objetivo definido
          </CardDescription>
        </div>
        <EditGoalsDialog
          current={{
            sessions: sessionsGoal?.target ?? 0,
            hours: hoursGoal?.target ?? 0,
            activePatients: activePatientsGoal?.target ?? 0,
          }}
        />
      </CardHeader>
      <CardContent className="flex justify-evenly gap-4">
        {goals.map((goal) => (
          <DashboardProgressBar
            key={goal.label}
            label={goal.label}
            metric={{ value: goal.current, target: goal.target }}
          />
        ))}
      </CardContent>
    </Card>
  )
}
