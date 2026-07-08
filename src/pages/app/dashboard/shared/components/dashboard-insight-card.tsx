import { AlertTriangle, Info, OctagonAlert } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InsightSeverity } from '../types'
import './dashboard-insight-card.css'

interface DashboardInsightCardAction {
  label: string
  onClick?: () => void
  disabled?: boolean
}

interface DashboardInsightCardProps {
  severity: InsightSeverity
  title: string
  description: string
  action?: DashboardInsightCardAction
}

const SEVERITY_CONFIG: Record<
  InsightSeverity,
  { icon: typeof Info; badgeClassName: string; label: string }
> = {
  [InsightSeverity.INFO]: {
    icon: Info,
    badgeClassName:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    label: 'Info',
  },
  [InsightSeverity.WARNING]: {
    icon: AlertTriangle,
    badgeClassName:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    label: 'Atenção',
  },
  [InsightSeverity.CRITICAL]: {
    icon: OctagonAlert,
    badgeClassName:
      'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    label: 'Crítico',
  },
}

export function DashboardInsightCard({
  severity,
  title,
  description,
  action,
}: DashboardInsightCardProps) {
  const config = SEVERITY_CONFIG[severity]
  const Icon = config.icon

  return (
    <Card className="dsh-insight-card-root">
      <CardContent className="dsh-insight-card-content">
        <div className="dsh-insight-card-header">
          <Badge className={config.badgeClassName}>
            <Icon className="size-3" />
            {config.label}
          </Badge>
        </div>
        <p className="dsh-insight-card-title">{title}</p>
        <p className="dsh-insight-card-description">{description}</p>
        {action && (
          <Button
            size="sm"
            variant="outline"
            disabled={action.disabled}
            onClick={action.onClick}
            className="dsh-insight-card-action"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
