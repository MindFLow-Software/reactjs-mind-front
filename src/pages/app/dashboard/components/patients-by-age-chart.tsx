import * as React from 'react'
import { Users, AlertCircle, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardData } from '../hooks/use-dashboard-data'
import './patients-by-age-chart.css'

type ContentState = 'loading' | 'error' | 'empty' | 'data'

interface AgeStats {
  range: string
  count: number
}

export const PatientsByAgeChart = React.memo(function PatientsByAgeChart() {
  const { data: dashboard, isLoading, isError, refetch } = useDashboardData()

  const data = React.useMemo<AgeStats[]>(
    () =>
      dashboard?.patientsByAge?.map((item) => ({
        range: item.range,
        count: item.count,
      })) ?? [],
    [dashboard],
  )

  const maxValue = React.useMemo<number>(
    () => Math.max(...data.map((d) => d.count), 1),
    [data],
  )

  const isEmpty = data.length === 0 || data.every((d) => d.count === 0)

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
          <div className="dsh-age-rows">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-3 w-14 shrink-0" />
                <Skeleton className="h-2.5 flex-1" />
                <Skeleton className="h-3 w-8 shrink-0" />
              </div>
            ))}
          </div>
        )
      case 'error':
        return (
          <div className="dsh-age-state">
            <AlertCircle className="size-5 text-red-500" />
            <p className="text-sm text-red-500">Erro ao carregar</p>
            <button onClick={() => refetch()} className="dsh-age-retry-btn">
              <RefreshCcw size={12} /> Tentar novamente
            </button>
          </div>
        )
      case 'empty':
        return (
          <div className="dsh-age-state">
            <div className="dsh-age-state-icon">
              <Users className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">Sem dados</p>
            <p className="text-xs text-muted-foreground">
              Nenhum paciente neste período
            </p>
          </div>
        )
      case 'data':
        return (
          <div className="dsh-age-rows">
            {data.map((item) => {
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
        )
    }
  }

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

      <CardContent className="dsh-age-content">{renderContent()}</CardContent>
    </Card>
  )
})
