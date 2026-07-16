import { Lightbulb } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IconBadge, IconBadgeTone } from '@/components/icon-badge/icon-badge'
import { DashboardInsightCard } from '@/pages/app/dashboard/shared/components/dashboard-insight-card/dashboard-insight-card'
import type { IDashboardInsight } from '@/types/dashboard/dashboard-insight'
import './insights-section.css'

type IInsightsSection = {
  insights: IDashboardInsight[]
}

export function InsightsSection({ insights }: IInsightsSection) {
  return (
    <Card className="dsh-insights-card">
      <CardHeader className="dsh-insights-header">
        <IconBadge tone={IconBadgeTone.AMBER}>
          <Lightbulb className="size-4" />
        </IconBadge>
        <div>
          <CardTitle className="dsh-insights-title">Insights</CardTitle>
          <CardDescription>
            Recomendações inteligentes para sua prática
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="dsh-insights-content">
        {insights.map((insight) => (
          <DashboardInsightCard key={insight.title} insight={insight} />
        ))}
      </CardContent>
    </Card>
  )
}
