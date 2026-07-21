import { CalendarCheck, CalendarX, RotateCcw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { IPsychologistDashboardData } from '@/types/dashboard/psychologist-dashboard-data'
import './attendance-section.css'

type IPsychologistDashboardAttendance = IPsychologistDashboardData['attendance']

type IAttendanceSection = {
  attendance: IPsychologistDashboardAttendance
}

type IAttendanceMetric = {
  key: keyof IPsychologistDashboardAttendance
  label: string
  icon: LucideIcon
  badgeClassName: string
}

const METRICS: IAttendanceMetric[] = [
  {
    key: 'attendedCount',
    label: 'Atendidas',
    icon: CalendarCheck,
    badgeClassName: 'bg-success/10 text-success dark:bg-success/20',
  },
  {
    key: 'cancelledCount',
    label: 'Canceladas',
    icon: CalendarX,
    badgeClassName: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
  },
  {
    key: 'rescheduledCount',
    label: 'Remarcadas',
    icon: RotateCcw,
    badgeClassName: 'bg-warning/10 text-warning dark:bg-warning/20',
  },
]

export function AttendanceSection({ attendance }: IAttendanceSection) {
  return (
    <Card className="dsh-attendance-card">
      <CardHeader className="dsh-attendance-header">
        <div>
          <CardTitle className="dsh-attendance-title">Comparecimento</CardTitle>
          <CardDescription>Indicadores chaves de presença</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="dsh-attendance-content">
        {METRICS.map(({ key, label, icon: Icon, badgeClassName }) => (
          <div key={key} className="dsh-attendance-row">
            <div className="dsh-attendance-row-main">
              <span className={cn('dsh-attendance-row-icon', badgeClassName)}>
                <Icon className="size-4" />
              </span>
              <span className="dsh-attendance-row-label">{label}</span>
            </div>
            <Badge variant="secondary" className="dsh-attendance-row-value">
              {attendance[key]}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
