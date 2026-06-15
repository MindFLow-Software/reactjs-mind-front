import * as React from 'react'
import { Users, AlertCircle, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardData } from '../hooks/use-dashboard-data'

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
          <div className="space-y-4">
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
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <AlertCircle className="size-5 text-red-500" />
            <p className="text-sm text-red-500">Erro ao carregar</p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline"
            >
              <RefreshCcw size={12} /> Tentar novamente
            </button>
          </div>
        )
      case 'empty':
        return (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30">
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
          <div className="space-y-4">
            {data.map((item) => {
              const pct = maxValue > 0 ? (item.count / maxValue) * 100 : 0
              return (
                <div key={item.range} className="flex items-center gap-4">
                  <span className="w-14 shrink-0 text-sm font-medium text-muted-foreground tabular-nums whitespace-nowrap">
                    {item.range}
                  </span>
                  <div className="flex-1 overflow-hidden rounded-full bg-muted h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-semibold text-foreground tabular-nums">
                    {item.count}
                  </span>
                </div>
              )
            })}
          </div>
        )
    }
  }

  return (
    <Card className="border-border bg-card shadow-sm rounded-xl flex flex-col">
      <CardHeader className="px-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
            <Users className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground leading-tight">
              Pacientes por faixa etária
            </p>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
              Distribuição atual
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-6">{renderContent()}</CardContent>
    </Card>
  )
})
