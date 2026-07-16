import { Activity } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconBadge, IconBadgeTone } from '@/components/icon-badge/icon-badge'
import { DashboardProgressBar } from '@/pages/app/dashboard/shared/components/dashboard-progress-bar/dashboard-progress-bar'
import { PatientsByAgeChart } from '../patients-by-age-chart/patients-by-age-chart'
import { PatientsByGenderChart } from '../patients-by-gender-chart/patients-by-gender-chart'
import type { IPsychologistDashboardData } from '@/types/dashboard/psychologist-dashboard-data'
import './analytics-section.css'

type IAnalyticsSection = {
  analytics: IPsychologistDashboardData['analytics']
}

export function AnalyticsSection({ analytics }: IAnalyticsSection) {
  return (
    <div className="dsh-analytics-root">
      <PatientsByAgeChart ageRange={analytics.ageRange} />
      <PatientsByGenderChart gender={analytics.gender} />

      <Card className="dsh-analytics-card">
        <CardHeader className="dsh-analytics-header">
          <div className="dsh-analytics-header-row">
            <IconBadge tone={IconBadgeTone.VIOLET}>
              <Activity className="size-4" />
            </IconBadge>
            <CardTitle className="dsh-analytics-title">
              Ocupação e retenção
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="dsh-analytics-content">
          <DashboardProgressBar
            label="Ocupação semanal"
            metric={{
              value: analytics.weeklyOccupancyPercent,
              target: 100,
              unit: '%',
            }}
            tone="violet"
          />
          <DashboardProgressBar
            label="Retenção de pacientes"
            metric={{
              value: analytics.retentionPercent,
              target: 100,
              unit: '%',
            }}
            tone="blue"
          />
        </CardContent>
      </Card>
    </div>
  )
}
