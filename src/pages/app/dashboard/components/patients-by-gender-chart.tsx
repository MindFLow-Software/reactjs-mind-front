import * as React from 'react'
import { Cell, Label, Pie, PieChart } from 'recharts'
import { Loader2, Users, AlertCircle, RefreshCcw } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useDashboardData } from '../hooks/use-dashboard-data'

const GENDER_TRANSLATIONS: Record<string, string> = {
  FEMININE: 'Feminino',
  MASCULINE: 'Masculino',
  OTHER: 'Outro',
}

const GENDER_COLORS: Record<string, string> = {
  Feminino: '#ec4899',
  Masculino: '#3b82f6',
  Outro: '#a855f7',
}

const CHART_COLORS = ['#ec4899', '#3b82f6', '#a855f7'] as const

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

    return (
      <Card className="border-border bg-card shadow-sm rounded-xl flex flex-col">
        <CardHeader className="px-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
              <Users className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground leading-tight">
                Perfil dos pacientes
              </p>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
                Distribuição por gênero
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-6 pb-6">
          {isLoading ? (
            <div className="flex h-[180px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="flex h-[180px] flex-col items-center justify-center gap-2 text-center">
              <AlertCircle className="size-5 text-red-500" />
              <p className="text-sm text-red-500">Erro ao carregar</p>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline"
              >
                <RefreshCcw size={12} /> Tentar novamente
              </button>
            </div>
          ) : isEmpty ? (
            <div className="flex h-[180px] flex-col items-center justify-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30">
                <Users className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Sem dados de gênero
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ChartContainer
                config={chartConfig}
                className="h-[160px] w-[160px] shrink-0"
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
                          GENDER_COLORS[item.gender] ??
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

              <div className="flex flex-col gap-3 flex-1">
                {chartData.map((item, index) => {
                  const color =
                    GENDER_COLORS[item.gender] ??
                    CHART_COLORS[index % CHART_COLORS.length]
                  const pct =
                    totalPatients > 0
                      ? Math.round((item.count / totalPatients) * 100)
                      : 0

                  return (
                    <div key={item.gender} className="flex items-center gap-2.5">
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-foreground flex-1">
                        {item.gender}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-muted-foreground">
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
          )}
        </CardContent>
      </Card>
    )
  },
)
