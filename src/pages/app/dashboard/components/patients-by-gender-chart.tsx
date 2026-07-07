import * as React from 'react'
import { Cell, Label, Pie, PieChart } from 'recharts'
import { Loader2, Users, AlertCircle, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useDashboardData } from '../hooks/use-dashboard-data'
import './patients-by-gender-chart.css'

type ContentState = 'loading' | 'error' | 'empty' | 'data'

const GENDER_TRANSLATIONS: Record<string, string> = {
  FEMININE: 'Feminino',
  MASCULINE: 'Masculino',
  OTHER: 'Outro',
}

const GENDER_COLORS: Record<string, string> = {
  FEMININE: 'var(--gender-feminine)',
  MASCULINE: 'var(--gender-masculine)',
  OTHER: 'var(--gender-other)',
}

const CHART_COLORS = [
  'var(--gender-feminine)',
  'var(--gender-masculine)',
  'var(--gender-other)',
] as const

const chartConfig = {
  patients: { label: 'Pacientes' },
} satisfies ChartConfig

export const PatientsByGenderChart = React.memo(
  function PatientsByGenderChart() {
    const { data: dashboard, isLoading, isError, refetch } = useDashboardData()

    const { chartData, totalPatients, isEmpty } = React.useMemo(() => {
      const rawData = dashboard?.patientsByGender
      if (!rawData) return { chartData: [], totalPatients: 0, isEmpty: true }
      const translated = rawData.map((item) => ({
        genderKey: item.gender,
        gender: GENDER_TRANSLATIONS[item.gender] || item.gender,
        count: item.count,
      }))
      const total = translated.reduce((sum, item) => sum + item.count, 0)
      return {
        chartData: translated,
        totalPatients: total,
        isEmpty: translated.length === 0 || total === 0,
      }
    }, [dashboard])

    const patientLabel = totalPatients === 1 ? 'PACIENTE' : 'PACIENTES'

    const contentState: ContentState = isLoading
      ? 'loading'
      : isError
        ? 'error'
        : isEmpty
          ? 'empty'
          : 'data'

    function renderContent() {
      switch (contentState) {
        case 'loading':
          return (
            <div className="dsh-gender-loading">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )
        case 'error':
          return (
            <div className="dsh-gender-state">
              <AlertCircle className="size-5 text-red-500" />
              <p className="text-sm text-red-500">Erro ao carregar</p>
              <button
                onClick={() => refetch()}
                className="dsh-gender-retry-btn"
              >
                <RefreshCcw size={12} /> Tentar novamente
              </button>
            </div>
          )
        case 'empty':
          return (
            <div className="dsh-gender-state">
              <div className="dsh-gender-state-icon">
                <Users className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Sem dados de gênero
              </p>
            </div>
          )
        case 'data':
          return (
            <div className="dsh-gender-data-row">
              <ChartContainer
                config={chartConfig}
                className="dsh-gender-chart-wrap"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="gender"
                    innerRadius={52}
                    outerRadius={72}
                    strokeWidth={4}
                    stroke="var(--card)"
                    paddingAngle={3}
                  >
                    {chartData.map((item, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          GENDER_COLORS[item.genderKey] ??
                          CHART_COLORS[index % CHART_COLORS.length]
                        }
                        className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 8}
                                fontSize={24}
                                fontWeight={600}
                                fill="currentColor"
                              >
                                {totalPatients}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 13}
                                fontSize={10}
                                fontWeight={600}
                                fill="currentColor"
                                opacity={0.55}
                                letterSpacing={1.5}
                              >
                                {patientLabel}
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="dsh-gender-legend">
                {chartData.map((item, index) => {
                  const color =
                    GENDER_COLORS[item.genderKey] ??
                    CHART_COLORS[index % CHART_COLORS.length]
                  const pct =
                    totalPatients > 0
                      ? Math.round((item.count / totalPatients) * 100)
                      : 0

                  return (
                    <div key={item.gender} className="dsh-gender-legend-item">
                      <div
                        className="dsh-gender-legend-dot"
                        style={{ backgroundColor: color }}
                      />
                      <span className="dsh-gender-legend-label">
                        {item.gender}
                      </span>
                      <span className="dsh-gender-legend-value">
                        {pct}%{' '}
                        <span className="font-normal text-xs">
                          ({item.count})
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
      }
    }

    return (
      <Card className="dsh-gender-card">
        <CardHeader className="dsh-gender-header">
          <div className="dsh-gender-header-row">
            <div className="dsh-gender-icon">
              <Users className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="dsh-gender-title">Perfil dos pacientes</p>
              <p className="dsh-gender-subtitle">Distribuição por gênero</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="dsh-gender-content">
          {renderContent()}
        </CardContent>
      </Card>
    )
  },
)
