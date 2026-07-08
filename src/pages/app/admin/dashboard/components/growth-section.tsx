import { UserPlus, UserRoundPlus, Building2 } from 'lucide-react'

import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section'
import { MetricCard } from '@/components/metric-card'
import { type ChartConfig } from '@/components/ui/chart'
import {
  calcSessionsGrowth,
  sumDailyCounts,
} from '@/pages/app/dashboard/shared/helpers'
import type { DashboardPeriod } from '@/pages/app/dashboard/shared/types'
import { TimeSeriesBarChartCard } from './time-series-bar-chart-card'
import type { IAdminDashboardGrowth, ITimeSeriesPoint } from '../types'
import './growth-section.css'

interface GrowthSectionProps {
  growth: IAdminDashboardGrowth
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
  isLoading: boolean
  isError: boolean
}

const psychologistsChartConfig = {
  count: {
    label: 'Psicólogos',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

function toTrendDirection(percent: number): 'up' | 'down' {
  return percent >= 0 ? 'up' : 'down'
}

export function GrowthSection({
  growth,
  period,
  onPeriodChange,
  isLoading,
  isError,
}: GrowthSectionProps) {
  const psychologistsTotal = sumDailyCounts(growth.newPsychologists)
  const patientsTotal = sumDailyCounts(growth.newPatients)
  const clinicsTotal = sumDailyCounts(growth.clinics)

  const patientsGrowth = calcSessionsGrowth(growth.newPatients)
  const clinicsGrowth = calcSessionsGrowth(growth.clinics)

  return (
    <DashboardSection
      index="02"
      title="Crescimento"
      description="Novos psicólogos, pacientes e clínicas no período selecionado"
    >
      <div className="adb-growth-grid">
        <TimeSeriesBarChartCard<ITimeSeriesPoint>
          header={{
            title: 'Fluxo de psicólogos',
            description: 'Novos profissionais integrados à plataforma',
            totalLabel: 'Novos cadastros',
            total: psychologistsTotal,
          }}
          timeRange={{
            value: period,
            onChange: (value) => onPeriodChange(value as DashboardPeriod),
          }}
          chart={{
            config: psychologistsChartConfig,
            dataKey: 'count',
            color: psychologistsChartConfig.count.color,
            data: growth.newPsychologists,
            isLoading,
            isEmpty: isError || psychologistsTotal === 0,
          }}
          empty={{
            icon: <UserPlus className="h-5 w-5 text-muted-foreground/50" />,
            title: 'Nenhum psicólogo',
            subtitle: 'Sem adesões no intervalo selecionado',
          }}
        />

        <div className="adb-growth-side">
          <MetricCard
            variant="stacked"
            accentColor="blue"
            isLoading={isLoading}
          >
            <MetricCard.Header
              icon={<UserRoundPlus className="size-4 text-blue-600" />}
              label="Novos pacientes"
              accentColor="blue"
            />
            <MetricCard.Value>
              {patientsTotal.toLocaleString()}
            </MetricCard.Value>
            <MetricCard.Trend
              direction={toTrendDirection(patientsGrowth)}
              label="vs. início do período"
            >
              {Math.abs(patientsGrowth)}%
            </MetricCard.Trend>
          </MetricCard>

          <MetricCard variant="stacked" accentColor="violet">
            <MetricCard.Header
              icon={<Building2 className="size-4 text-violet-600" />}
              label="Novas clínicas"
              accentColor="violet"
            />
            <MetricCard.Value>{clinicsTotal.toLocaleString()}</MetricCard.Value>
            <MetricCard.Trend
              direction={toTrendDirection(clinicsGrowth)}
              label="vs. início do período"
            >
              {Math.abs(clinicsGrowth)}%
            </MetricCard.Trend>
          </MetricCard>
        </div>
      </div>
    </DashboardSection>
  )
}
