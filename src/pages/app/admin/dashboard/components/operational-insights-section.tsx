import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section/dashboard-section'
import { DashboardInsightCard } from '@/pages/app/dashboard/shared/components/dashboard-insight-card/dashboard-insight-card'
import type { IDashboardInsight } from '@/types/dashboard/dashboard-insight'
import './operational-insights-section.css'

interface OperationalInsightsSectionProps {
  insights: IDashboardInsight[]
}

export function OperationalInsightsSection({
  insights,
}: OperationalInsightsSectionProps) {
  return (
    <DashboardSection
      header={{
        index: '07',
        title: 'Insights operacionais',
        description: 'Pontos de atenção que merecem ação da equipe',
      }}
    >
      <div className="adb-insights-grid">
        {insights.map((insight, index) => (
          <DashboardInsightCard
            key={`${insight.title}-${index}`}
            insight={insight}
          />
        ))}
      </div>
    </DashboardSection>
  )
}
