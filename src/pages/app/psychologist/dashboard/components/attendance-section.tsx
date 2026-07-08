import { CalendarCheck, CalendarX, RotateCcw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { IPsychologistDashboardAttendance } from '../types'
import './attendance-section.css'

interface AttendanceSectionProps {
  attendance: IPsychologistDashboardAttendance
}

interface AttendanceMetric {
  key: keyof IPsychologistDashboardAttendance
  label: string
  icon: LucideIcon
  badgeClassName: string
}

const METRICS: AttendanceMetric[] = [
  {
    key: 'attendedCount',
    label: 'Atendidas',
    icon: CalendarCheck,
    badgeClassName:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  },
  {
    key: 'cancelledCount',
    label: 'Canceladas',
    icon: CalendarX,
    badgeClassName:
      'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  },
  {
    key: 'rescheduledCount',
    label: 'Remarcadas',
    icon: RotateCcw,
    badgeClassName:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  },
]

export function AttendanceSection({ attendance }: AttendanceSectionProps) {
  return (
    <Card className="dsh-attendance-card">
      <CardHeader className="dsh-attendance-header">
        <CardTitle className="dsh-attendance-title">Comparecimento</CardTitle>
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
