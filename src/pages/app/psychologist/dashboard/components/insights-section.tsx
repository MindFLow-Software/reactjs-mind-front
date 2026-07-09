import { Lightbulb } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardInsightCard } from '@/pages/app/dashboard/shared/components/dashboard-insight-card'
import type { IDashboardInsight } from '@/pages/app/dashboard/shared/types'
import './insights-section.css'

interface InsightsSectionProps {
  insights: IDashboardInsight[]
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  return (
    <Card className="dsh-insights-card">
      <CardHeader className="dsh-insights-header">
        <div className="dsh-insights-icon">
          <Lightbulb className="size-4 text-amber-600" />
        </div>
        <div>
          <CardTitle className="dsh-insights-title">Insights</CardTitle>
          <CardDescription>Recomendações inteligentes para sua prática</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="dsh-insights-content">
        {insights.map((insight) => (
          <DashboardInsightCard
            key={insight.id}
            severity={insight.severity}
            title={insight.title}
            description={insight.description}
            // action={
            //   insight.actionLabel
            //     ? { label: insight.actionLabel, disabled: true }
            //     : undefined
            // }
          />
        ))}
      </CardContent>
    </Card>
  )
}
