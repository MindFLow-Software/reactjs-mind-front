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
  TrendingUp,
  TrendingDown,
  Minus,
  type LucideIcon,
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
import type { DailySessionMetric } from '@/api/metrics/get-daily-sessions-metrics'
import {
  calcDailyAverage,
  calcSessionsGrowth,
} from '@/pages/app/dashboard/shared/helpers'
import { type DashboardPeriod } from '../constants'
import { useSessionsBar } from '../hooks/use-sessions-bar'
import { buildPsychologistMock } from '../mocks/psychologist-dashboard.mock'
import './sessions-chart.css'

interface SessionsBarChartProps {
  period: DashboardPeriod
}

interface SessionsVolumePoint {
  date: string
  completed: number
  cancelled: number
  rescheduled: number
}

const chartConfig = {
  completed: {
    label: 'Concluídas',
    color: 'var(--chart-sessions-green)',
  },
  cancelled: {
    label: 'Canceladas',
    color: 'var(--chart-sessions-red)',
  },
  rescheduled: {
    label: 'Remarcadas',
    color: 'var(--chart-sessions-amber)',
  },
} satisfies ChartConfig

const LEGEND = [
  { key: 'completed', label: 'Concluídas', color: 'bg-green-500' },
  { key: 'cancelled', label: 'Canceladas', color: 'bg-red-500' },
  { key: 'rescheduled', label: 'Remarcadas', color: 'bg-amber-500' },
] as const

type GrowthTone = 'up' | 'down' | 'flat'

const GROWTH_ICON: Record<GrowthTone, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
}

const GROWTH_CLASS: Record<GrowthTone, string> = {
  up: 'dsh-sessions-growth-up',
  down: 'dsh-sessions-growth-down',
  flat: 'dsh-sessions-growth-flat',
}

function getGrowthTone(value: number): GrowthTone {
  if (value > 0) return 'up'
  if (value < 0) return 'down'
  return 'flat'
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10)
}

function mergeSessionsVolume(
  completed: DailySessionMetric[],
  cancelled: DailySessionMetric[],
  rescheduled: DailySessionMetric[],
): SessionsVolumePoint[] {
  const cancelledByDate = new Map(
    cancelled.map((point) => [toDateKey(point.date), point.count]),
  )
  const rescheduledByDate = new Map(
    rescheduled.map((point) => [toDateKey(point.date), point.count]),
  )

  return completed.map((point) => {
    const key = toDateKey(point.date)
    return {
      date: point.date,
      completed: point.count,
      cancelled: cancelledByDate.get(key) ?? 0,
      rescheduled: rescheduledByDate.get(key) ?? 0,
    }
  })
}

function GrowthBadge({ value }: { value: number }) {
  const tone = getGrowthTone(value)
  const Icon = GROWTH_ICON[tone]
  const sign = value > 0 ? '+' : ''

  return (
    <span className={cn('dsh-sessions-growth', GROWTH_CLASS[tone])}>
      <Icon className="size-3.5" />
      {sign}
      {value}%
    </span>
  )
}

export const SessionsBarChart = React.memo(function SessionsBarChart({
  period,
}: SessionsBarChartProps) {
  const {
    data: completed,
    subtitleLabel,
    isLoading,
    isError,
    refetch,
  } = useSessionsBar(period)

  const mock = React.useMemo(() => buildPsychologistMock(period), [period])

  const chartData = React.useMemo(
    () =>
      mergeSessionsVolume(
        completed,
        mock.sessionsVolume.cancelled,
        mock.sessionsVolume.rescheduled,
      ),
    [completed, mock],
  )

  const growthPercent = React.useMemo(
    () => calcSessionsGrowth(completed),
    [completed],
  )

  const dailyAverage = React.useMemo(
    () => calcDailyAverage(completed.map((point) => point.count)),
    [completed],
  )

  const isEmpty = React.useMemo(() => {
    const total = completed.reduce((acc, point) => acc + point.count, 0)
    return completed.length === 0 || total === 0
  }, [completed])

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
          <div className="dsh-sessions-header-side">
            <div className="dsh-sessions-stats">
              <div className="dsh-sessions-stat">
                <span className="dsh-sessions-stat-label">Crescimento</span>
                <GrowthBadge value={growthPercent} />
              </div>
              <div className="dsh-sessions-stat">
                <span className="dsh-sessions-stat-label">Média diária</span>
                <span className="dsh-sessions-stat-value">{dailyAverage}</span>
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
                dataKey="completed"
                fill="var(--chart-sessions-green)"
                radius={[8, 8, 0, 0]}
                className="cursor-pointer"
              />
              <Bar
                dataKey="cancelled"
                fill="var(--chart-sessions-red)"
                radius={[8, 8, 0, 0]}
                className="cursor-pointer"
              />
              <Bar
                dataKey="rescheduled"
                fill="var(--chart-sessions-amber)"
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
