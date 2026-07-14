import { Activity } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardProgressBar } from '@/pages/app/dashboard/shared/components/dashboard-progress-bar'
import { PatientsByAgeChart } from './patients-by-age-chart'
import { PatientsByGenderChart } from './patients-by-gender-chart'
import type { IPsychologistDashboardData } from '@/types/dashboard'
import './analytics-section.css'

interface AnalyticsSectionProps {
  analytics: IPsychologistDashboardData['analytics']
}

export function AnalyticsSection({ analytics }: AnalyticsSectionProps) {
  return (
    <div className="dsh-analytics-root">
      <PatientsByAgeChart ageRange={analytics.ageRange} />
      <PatientsByGenderChart gender={analytics.gender} />

      <Card className="dsh-analytics-card">
        <CardHeader className="dsh-analytics-header">
          <div className="dsh-analytics-header-row">
            <div className="dsh-analytics-icon">
              <Activity className="size-4 text-violet-600" />
            </div>
            <CardTitle className="dsh-analytics-title">
              Ocupação e retenção
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="dsh-analytics-content">
          <DashboardProgressBar
            label="Ocupação semanal"
            value={analytics.weeklyOccupancyPercent}
            target={100}
            unit="%"
            tone="violet"
          />
          <DashboardProgressBar
            label="Retenção de pacientes"
            value={analytics.retentionPercent}
            target={100}
            unit="%"
            tone="blue"
          />
        </CardContent>
      </Card>
    </div>
  )
}
