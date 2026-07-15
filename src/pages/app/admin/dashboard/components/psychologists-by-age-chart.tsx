'use client'

import * as React from 'react'
import { Users2 } from 'lucide-react'

import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts'

import type { IAgeRangeItem } from '@/types/dashboard/age-range-item'

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'

import { DashboardChartEmpty } from '@/pages/app/dashboard/shared/components/dashboard-chart-empty/dashboard-chart-empty'
import { DashboardChartError } from '@/pages/app/dashboard/shared/components/dashboard-chart-error/dashboard-chart-error'
import { DashboardChartLoader } from '@/pages/app/dashboard/shared/components/dashboard-chart-loader/dashboard-chart-loader'

import './psychologists-by-age-chart.css'

const chartConfig = {
  psychologists: {
    label: 'Psicólogos',
  },
} satisfies ChartConfig

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

interface IPsychologistsAgeRangeChart {
  isError: boolean
  onRetry: () => void
  isLoading: boolean
  psychologistsByAge: IAgeRangeItem[]
}

export function PsychologistsAgeRangeChart({
  isError,
  onRetry,
  isLoading,
  psychologistsByAge,
}: IPsychologistsAgeRangeChart) {
  const { totalPsychologists, isEmpty } = React.useMemo(() => {
    const total =
      psychologistsByAge?.reduce((sum, item) => sum + item.count, 0) ?? 0
    return {
      totalPsychologists: total,
      isEmpty:
        !psychologistsByAge || psychologistsByAge.length === 0 || total === 0,
    }
  }, [psychologistsByAge])

  const chartColor = React.useMemo(() => Math.round(Math.random() * 4), [])

  return (
    <Card className="adb-bar-card">
      <CardHeader className="adb-bar-card-header">
        <div className="adb-bar-header-main">
          <CardTitle className="adb-bar-title">Faixa Etária</CardTitle>
          <CardDescription className="adb-bar-header-subtitle">
            Distribuição por idade
          </CardDescription>
        </div>
        <div className="adb-bar-total-block">
          <p className="adb-bar-total-label">Total de Psicólogos</p>
          <p className="adb-bar-total-value">{totalPsychologists}</p>
        </div>
      </CardHeader>
      <CardContent className="adb-bar-content">
        {isLoading ? (
          <DashboardChartLoader />
        ) : isError ? (
          <DashboardChartError onRetry={onRetry} />
        ) : isEmpty ? (
          <DashboardChartEmpty
            icon={<Users2 />}
            title="Sem dados demográficos"
            subtitle="Nenhum psicólogo cadastrado no sistema"
          />
        ) : (
          <div className="adb-bar-chart-wrap">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square size-full"
            >
              <BarChart data={psychologistsByAge}>
                <XAxis dataKey="range" />
                <YAxis tickCount={5} allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill={CHART_COLORS[chartColor]}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
