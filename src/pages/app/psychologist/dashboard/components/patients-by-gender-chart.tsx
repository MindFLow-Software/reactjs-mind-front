import * as React from 'react'
import { Cell, Label, Pie, PieChart } from 'recharts'
import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { DashboardChartEmpty } from '@/pages/app/dashboard/shared/components/dashboard-chart-empty'
import { Gender } from '@/types/shared/enums'
import type { IGenderItem } from '@/types/dashboard'
import './patients-by-gender-chart.css'

const GENDER_TRANSLATIONS: Record<Gender, string> = {
  [Gender.FEMININE]: 'Feminino',
  [Gender.MASCULINE]: 'Masculino',
  [Gender.OTHER]: 'Outro',
}

const GENDER_COLORS: Record<Gender, string> = {
  [Gender.FEMININE]: 'var(--gender-feminine)',
  [Gender.MASCULINE]: 'var(--gender-masculine)',
  [Gender.OTHER]: 'var(--gender-other)',
}

const chartConfig = {
  patients: { label: 'Pacientes' },
} satisfies ChartConfig

interface PatientsByGenderChartProps {
  gender: IGenderItem[]
}

export const PatientsByGenderChart = React.memo(function PatientsByGenderChart({
  gender,
}: PatientsByGenderChartProps) {
  const { chartData, totalPatients, isEmpty } = React.useMemo(() => {
    const translated = gender.map((item) => ({
      genderKey: item.gender,
      gender: GENDER_TRANSLATIONS[item.gender],
      count: item.count,
    }))
    const total = translated.reduce((sum, item) => sum + item.count, 0)
    return {
      chartData: translated,
      totalPatients: total,
      isEmpty: translated.length === 0 || total === 0,
    }
  }, [gender])

  const patientLabel = totalPatients === 1 ? 'PACIENTE' : 'PACIENTES'

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
        {isEmpty ? (
          <DashboardChartEmpty
            icon={<Users className="h-5 w-5" />}
            title="Sem dados de gênero"
            subtitle="Nenhum paciente neste período"
          />
        ) : (
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
                      fill={GENDER_COLORS[item.genderKey]}
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
                const color = GENDER_COLORS[item.genderKey]
                const pct =
                  totalPatients > 0
                    ? Math.round((item.count / totalPatients) * 100)
                    : 0

                return (
                  <div key={index} className="dsh-gender-legend-item">
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
        )}
      </CardContent>
    </Card>
  )
})
