import * as React from 'react'
import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DashboardChartEmpty } from '@/pages/app/dashboard/shared/components/dashboard-chart-empty/dashboard-chart-empty'
import type { IAgeRangeItem } from '@/types/dashboard/age-range-item'
import './patients-by-age-chart.css'

interface PatientsByAgeChartProps {
  ageRange: IAgeRangeItem[]
}

export const PatientsByAgeChart = React.memo(function PatientsByAgeChart({
  ageRange,
}: PatientsByAgeChartProps) {
  const maxValue = React.useMemo<number>(
    () => Math.max(...ageRange.map((item) => item.count), 1),
    [ageRange],
  )

  const isEmpty =
    ageRange.length === 0 || ageRange.every((item) => item.count === 0)

  return (
    <Card className="dsh-age-card">
      <CardHeader className="dsh-age-header">
        <div className="dsh-age-header-row">
          <div className="dsh-age-icon">
            <Users className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="dsh-age-title">Pacientes por faixa etária</p>
            <p className="dsh-age-subtitle">Distribuição atual</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="dsh-age-content">
        {isEmpty ? (
          <DashboardChartEmpty
            icon={<Users className="h-5 w-5" />}
            title="Sem dados"
            subtitle="Nenhum paciente neste período"
          />
        ) : (
          <div className="dsh-age-rows">
            {ageRange.map((item) => {
              const pct = maxValue > 0 ? (item.count / maxValue) * 100 : 0
              return (
                <div key={item.range} className="dsh-age-row">
                  <span className="dsh-age-row-label">{item.range}</span>
                  <div className="dsh-age-row-track">
                    <div
                      className="dsh-age-row-bar"
                      style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
                    />
                  </div>
                  <span className="dsh-age-row-value">{item.count}</span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
})
