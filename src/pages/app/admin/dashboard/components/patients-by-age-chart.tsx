import React from 'react'
import { CalendarRange } from 'lucide-react'

import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'

import type { AgeRangeItem } from '@/types/dashboard'
import { DashboardChartLoader } from '@/pages/app/dashboard/shared/components/dashboard-chart-loader'
import { DashboardChartError } from '@/pages/app/dashboard/shared/components/dashboard-chart-error'
import { DashboardChartEmpty } from '@/pages/app/dashboard/shared/components/dashboard-chart-empty'



const chartConfig = {} satisfies ChartConfig

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

interface IPatientsByGenderChart {
  isError: boolean
  onRetry: () => void
  isLoading: boolean
  patientsByAge: AgeRangeItem[]
}

export function PatientsByGenderChart({
  isError,
  onRetry,
  isLoading,
  patientsByAge,
}: IPatientsByGenderChart) {
  const { totalPatients, isEmpty } = React.useMemo(() => {
    const total = patientsByAge?.reduce((sum, item) => sum + item.count, 0) ?? 0
    return {
      totalPatients: total,
      isEmpty: !patientsByAge || patientsByAge.length === 0 || total === 0,
    }
  }, [patientsByAge])

  const chartColor = React.useMemo(() => Math.round(Math.random() * 4), [])

  return (
    <Card className="adb-bar-card">
      <CardHeader className="adb-bar-card-header">
        <div className="adb-bar-header-main">
          <CardTitle className="adb-bar-title">
            Faixa Etária
          </CardTitle>
          <CardDescription className="adb-bar-header-subtitle">
            Distribuição por idade
          </CardDescription>
        </div>
        <div className="adb-bar-total-block">
          <p className="adb-bar-total-label">Total de Pacientes</p>
          <p className="adb-bar-total-value">{totalPatients}</p>
        </div>
      </CardHeader>
      <CardContent className="adb-bar-content">
        {isLoading
          ? (<DashboardChartLoader />)
          : isError ? (<DashboardChartError onRetry={onRetry} />)
            : isEmpty ? (
              <DashboardChartEmpty
                icon={<CalendarRange />}
                title="Sem dados etários"
                subtitle="Nenhum paciente com idade registrada"
              />
            ) : (
              <div className="adb-bar-chart-wrap">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square size-full"
                >
                  <BarChart data={patientsByAge}>
                    <XAxis dataKey="range" />
                    <YAxis tickCount={5} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill={CHART_COLORS[chartColor]} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
      </CardContent>
    </Card>
  )
}