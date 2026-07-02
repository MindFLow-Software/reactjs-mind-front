import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CalendarOff,
  Loader2,
  RefreshCcw,
  AlertCircle,
  ChartLine,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { type DashboardPeriod } from '../constants'
import { useSessionsBar } from '../hooks/use-sessions-bar'

interface SessionsBarChartProps {
  period: DashboardPeriod
}

const chartConfig = {
  count: {
    label: 'Concluídas',
    color: '#22c55e',
  },
} satisfies ChartConfig

const LEGEND = [
  { key: 'completed', label: 'Concluídas', color: 'bg-green-500' },
] as const

export const SessionsBarChart = React.memo(function SessionsBarChart({
  period,
}: SessionsBarChartProps) {
  const {
    data: chartData,
    subtitleLabel,
    isLoading,
    isError,
    refetch,
  } = useSessionsBar(period)

  const isEmpty = React.useMemo(() => {
    const total = chartData.reduce((acc, d) => acc + d.count, 0)
    return chartData.length === 0 || total === 0
  }, [chartData])

  return (
    <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="px-6 pb-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <ChartLine className="size-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground leading-tight">
                Volume de sessões
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs text-muted-foreground">
                {subtitleLabel} · sessões concluídas, canceladas e remarcadas
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start">
            {LEGEND.map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${color}`}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 bg-card">
        {isLoading ? (
          <div className="flex h-[250px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="flex h-[250px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <AlertCircle className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Erro ao carregar dados
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
            >
              <RefreshCcw size={12} /> Tentar novamente
            </button>
          </div>
        ) : isEmpty ? (
          <div className="flex h-[250px] flex-col items-center justify-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30">
              <CalendarOff className="size-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Nenhuma sessão
            </p>
            <p className="text-xs text-muted-foreground">
              Sem atendimentos neste período
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 0, right: 0, top: 10 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickFormatter={(value) =>
                  format(new Date(value), 'dd MMM', { locale: ptBR })
                }
              />
              <YAxis hide domain={[0, 'auto']} />
              <ChartTooltip
                cursor={{ fill: 'var(--muted)', opacity: 0.2, radius: 8 }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), "dd 'de' MMMM", { locale: ptBR })
                    }
                    indicator="dashed"
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
                className="cursor-pointer"
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
})
