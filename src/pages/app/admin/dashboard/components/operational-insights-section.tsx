import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'
import { DashboardInsightCard } from '@/pages/app/dashboard/shared/components/dashboard-insight-card'
import type { IDashboardInsight } from '@/pages/app/dashboard/shared/types'
import './operational-insights-section.css'

interface OperationalInsightsSectionProps {
  insights: IDashboardInsight[]
}

export function OperationalInsightsSection({
  insights,
}: OperationalInsightsSectionProps) {
  return (
    <DashboardSection
      index="07"
      title="Insights operacionais"
      description="Pontos de atenção que merecem ação da equipe"
    >
      <div className="adb-insights-grid">
        {insights.map((insight) => (
          <DashboardInsightCard
            key={insight.id}
            severity={insight.severity}
            title={insight.title}
            description={insight.description}
            action={
              insight.actionLabel
                ? { label: insight.actionLabel, disabled: true }
                : undefined
            }
          />
        ))}
      </div>
    </DashboardSection>
  )
}
