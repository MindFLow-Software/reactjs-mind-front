'use client'

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Users, AlertCircle, RefreshCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchDashboardData } from "@/api/metrics/fetch-dashboard-data"
import type { DashboardPeriod } from "./dashboard-header"

interface AgeStats {
    range: string
    count: number
}

interface PatientsByAgeChartProps {
  period: DashboardPeriod
}

export const PatientsByAgeChart = React.memo(function PatientsByAgeChart({ period: _period }: PatientsByAgeChartProps) {
    const { data: dashboard, isLoading, isError, refetch } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => fetchDashboardData({}),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const data: AgeStats[] = React.useMemo(
        () => dashboard?.patientsByAge?.map(item => ({ range: item.range, count: item.count })) ?? [],
        [dashboard]
    )

    const maxValue = React.useMemo(
        () => Math.max(...(data.map(d => d.count)), 1),
        [data]
    )

    const isEmpty = data.length === 0 || data.every(d => d.count === 0)

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl flex flex-col">
      <CardHeader className="px-6 pt-5 pb-4">
        <CardTitle className="text-base font-semibold text-foreground">
          Pacientes por faixa etária
        </CardTitle>
        <CardDescription className="text-xs text-blue-500 font-medium">
          Distribuição atual
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-6">
          {isLoading ? (
              <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-3 w-14 shrink-0" />
                          <Skeleton className="h-2.5 flex-1" />
                          <Skeleton className="h-3 w-8 shrink-0" />
                      </div>
                  ))}
              </div>
          ) : isError ? (
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
          ) : isEmpty ? (
              <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30">
                      <Users className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Sem dados</p>
                  <p className="text-xs text-muted-foreground">Nenhum paciente neste período</p>
              </div>
          ) : (
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
          )}
      </CardContent>
    </Card>
  )
})
