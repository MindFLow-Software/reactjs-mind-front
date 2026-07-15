import { UserRoundPlus, Building2 } from 'lucide-react'

import { MetricCard } from '@/components/metric-card/metric-card'
import { DashboardSection } from '@/pages/app/dashboard/shared/components/dashboard-section/dashboard-section'
import { calcGrowthPercentage } from '@/pages/app/dashboard/shared/helpers'
import type { IDashboardPeriod } from '@/pages/app/dashboard/shared/types'
import type { IAdminDashboardData } from '@/types/dashboard/admin-dashboard-data'
import type { ITimeSeriesPoint } from '@/types/dashboard/time-series-point'

import { GrowthFlowChart } from '../growth-flow-chart/growth-flow-chart'

import './growth-section.css'

type IAdminDashboardGrowth = IAdminDashboardData['growth']

type IGrowthSection = {
  growth: IAdminDashboardGrowth
  period: IDashboardPeriod
  onPeriodChange: (period: IDashboardPeriod) => void
}

function sumSeriesValues(series: ITimeSeriesPoint[]): number {
  return series.reduce((total, point) => total + point.value, 0)
}

function calcSeriesGrowth(series: ITimeSeriesPoint[]): number {
  if (series.length < 2) return 0
  const mid = Math.floor(series.length / 2)
  const previous = sumSeriesValues(series.slice(0, mid))
  const current = sumSeriesValues(series.slice(mid))
  return calcGrowthPercentage(current, previous)
}

function toTrendDirection(percent: number): 'up' | 'down' {
  return percent >= 0 ? 'up' : 'down'
}

export function GrowthSection({
  growth,
  period,
  onPeriodChange,
}: IGrowthSection) {
  const psychologistsTotal = sumSeriesValues(growth.newPsychologists)
  const patientsTotal = sumSeriesValues(growth.newPatients)
  const clinicsTotal = sumSeriesValues(growth.clinics)

  const patientsGrowth = calcSeriesGrowth(growth.newPatients)
  const clinicsGrowth = calcSeriesGrowth(growth.clinics)

  return (
    <DashboardSection
      header={{
        index: '02',
        title: 'Crescimento',
        description:
          'Novos psicólogos, pacientes e clínicas no período selecionado',
      }}
    >
      <div className="adb-growth-grid">
        <GrowthFlowChart
          data={growth.newPsychologists}
          total={psychologistsTotal}
          period={{ value: period, onChange: onPeriodChange }}
        />

        <div className="adb-growth-side">
          <MetricCard variant="stacked" accentColor="blue">
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
