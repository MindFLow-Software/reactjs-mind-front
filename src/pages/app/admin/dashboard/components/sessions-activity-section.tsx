import { CheckCircle2, CalendarClock, XCircle, Activity } from 'lucide-react'

import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'
import { MetricCard } from '@/components/metric-card'
import type { IAdminDashboardData } from '@/types/dashboard/admin-dashboard-data'
import './sessions-activity-section.css'

type IAdminDashboardActivity = IAdminDashboardData['activity']

interface SessionsActivitySectionProps {
  activity: IAdminDashboardActivity
}

export function SessionsActivitySection({
  activity,
}: SessionsActivitySectionProps) {
  return (
    <DashboardSection
      index="04"
      title="Sessões & Atividade"
      description="Volume de sessões e atividade de usuários no período selecionado"
    >
      <div className="adb-activity-content">
        <MetricCard variant="stacked" accentColor="emerald">
          <MetricCard.Header
            icon={<CheckCircle2 className="size-4 text-emerald-600" />}
            label="Sessões concluídas"
            accentColor="emerald"
          />
          <MetricCard.Value>
            {activity.completed.toLocaleString('pt-BR')}
          </MetricCard.Value>
        </MetricCard>

        <MetricCard variant="stacked" accentColor="blue">
          <MetricCard.Header
            icon={<CalendarClock className="size-4 text-blue-600" />}
            label="Sessões remarcadas"
            accentColor="blue"
          />
          <MetricCard.Value>
            {activity.rescheduled.toLocaleString('pt-BR')}
          </MetricCard.Value>
        </MetricCard>

        <MetricCard variant="stacked" accentColor="violet">
          <MetricCard.Header
            icon={<XCircle className="size-4 text-violet-600" />}
            label="Sessões canceladas"
            accentColor="violet"
          />
          <MetricCard.Value>
            {activity.canceled.toLocaleString('pt-BR')}
          </MetricCard.Value>
        </MetricCard>

        <MetricCard variant="stacked" accentColor="emerald">
          <MetricCard.Header
            icon={<Activity className="size-4 text-emerald-600" />}
            label="Usuários ativos"
            accentColor="emerald"
          />
          <MetricCard.Value>
            {activity.activeUsers.toLocaleString('pt-BR')}
          </MetricCard.Value>
        </MetricCard>
      </div>
    </DashboardSection>
  )
}
