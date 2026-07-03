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
import { cn } from '@/lib/utils'
import { type DashboardPeriod } from '../constants'
import { useSessionsBar } from '../hooks/use-sessions-bar'
import './sessions-chart.css'

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
    <Card className="dsh-sessions-card">
      <CardHeader className="dsh-sessions-header">
        <div className="dsh-sessions-header-row">
          <div className="dsh-sessions-header-main">
            <div className="dsh-sessions-icon">
              <ChartLine className="size-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="dsh-sessions-title">
                Volume de sessões
              </CardTitle>
              <CardDescription className="dsh-sessions-subtitle">
                {subtitleLabel} · sessões concluídas, canceladas e remarcadas
              </CardDescription>
            </div>
          </div>
          <div className="dsh-sessions-legend">
            {LEGEND.map(({ key, label, color }) => (
              <div key={key} className="dsh-sessions-legend-item">
                <span className={cn('dsh-sessions-legend-dot', color)} />
                <span className="dsh-sessions-legend-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="dsh-sessions-content">
        {isLoading ? (
          <div className="flex h-[250px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="dsh-sessions-state">
            <div className="dsh-sessions-state-icon">
              <AlertCircle className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Erro ao carregar dados
            </p>
            <button
              onClick={() => refetch()}
              className="dsh-sessions-retry-btn"
            >
              <RefreshCcw size={12} /> Tentar novamente
            </button>
          </div>
        ) : isEmpty ? (
          <div className="dsh-sessions-state">
            <div className="dsh-sessions-empty-icon">
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
