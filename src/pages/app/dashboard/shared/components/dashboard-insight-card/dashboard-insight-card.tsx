import {
  AlertTriangle,
  Info,
  OctagonAlert,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { InsightSeverity } from '@/types/shared/enums'
import type { IDashboardInsight } from '@/types/dashboard/dashboard-insight'

import './dashboard-insight-card.css'

type IDashboardInsightCardAction = {
  label: string
  onClick?: () => void
  disabled?: boolean
}

type IDashboardInsightCard = {
  insight: IDashboardInsight
  action?: IDashboardInsightCardAction
}

const SEVERITY_CONFIG: Record<
  InsightSeverity,
  { icon: LucideIcon; badgeClassName: string; label: string }
> = {
  [InsightSeverity.INFO]: {
    icon: Info,
    badgeClassName: 'bg-primary/10 text-primary',
    label: 'Info',
  },
  [InsightSeverity.WARNING]: {
    icon: AlertTriangle,
    badgeClassName: 'bg-warning/10 text-warning',
    label: 'Atenção',
  },
  [InsightSeverity.CRITICAL]: {
    icon: OctagonAlert,
    badgeClassName: 'bg-destructive/10 text-destructive',
    label: 'Crítico',
  },
}

export function DashboardInsightCard({
  insight,
  action,
}: IDashboardInsightCard) {
  const config = SEVERITY_CONFIG[insight.severity]
  const Icon = config.icon

  return (
    <Card className="dsh-insight-card-root">
      <CardHeader className="dsh-insight-card-header">
        <p className="dsh-insight-card-title">{insight.title}</p>
        <Badge className={config.badgeClassName}>
          <Icon className="size-3" />
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="dsh-insight-card-content">
        <p className="dsh-insight-card-description">{insight.description}</p>
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
