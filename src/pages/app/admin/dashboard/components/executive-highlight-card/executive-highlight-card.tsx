import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { Area, AreaChart } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { ChartContainer } from '@/components/ui/chart'
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

import './executive-highlight-card.css'

export enum ExecutiveHighlightAccent {
  BLUE = 'blue',
  GREEN = 'green',
}

export enum ExecutiveTrendDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

type IExecutiveHighlightPoint = {
  date: string
  value: number
}

const ACCENT_CHART: Record<
  ExecutiveHighlightAccent,
  { gradientId: string; fill: string; stroke: string }
> = {
  [ExecutiveHighlightAccent.BLUE]: {
    gradientId: 'ehc-fill-blue',
    fill: 'var(--chart-blue)',
    stroke: 'var(--chart-blue)',
  },
  [ExecutiveHighlightAccent.GREEN]: {
    gradientId: 'ehc-fill-green',
    fill: 'var(--chart-sessions-green-soft)',
    stroke: 'var(--chart-sessions-green)',
  },
}

const TREND_BADGE: Record<
  ExecutiveTrendDirection,
  { icon: ReactNode; className: string }
> = {
  [ExecutiveTrendDirection.UP]: {
    icon: <TrendingUp size={14} />,
    className: 'adb-exec-badge--up',
  },
  [ExecutiveTrendDirection.DOWN]: {
    icon: <TrendingDown size={14} />,
    className: 'adb-exec-badge--down',
  },
}

const ExecutiveHighlightContext = createContext<ExecutiveHighlightAccent>(
  ExecutiveHighlightAccent.BLUE,
)

type IExecutiveHighlightRoot = {
  accent: ExecutiveHighlightAccent
  series: IExecutiveHighlightPoint[]
  children: ReactNode
}

type IExecutiveHighlightHeader = {
  icon: ReactNode
  label: string
}

type IExecutiveHighlightValue = {
  trend: {
    direction: ExecutiveTrendDirection
    label: string
  }
  children: ReactNode
}

type IExecutiveHighlightStat = {
  label: string
  value: string
}

type IExecutiveHighlightSlot = {
  children: ReactNode
}

function ExecutiveHighlightChart({
  series,
}: {
  series: IExecutiveHighlightPoint[]
}) {
  const accent = useContext(ExecutiveHighlightContext)
  const chart = ACCENT_CHART[accent]

  return (
    <ChartContainer config={{}} className="adb-exec-chart">
      <AreaChart data={series}>
        <defs>
          <linearGradient id={chart.gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chart.fill} stopOpacity={1} />
            <stop offset="95%" stopColor={chart.fill} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          fill={`url(#${chart.gradientId})`}
          stroke={chart.stroke}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function ExecutiveHighlightRoot({
  accent,
  series,
  children,
}: IExecutiveHighlightRoot) {
  return (
    <ExecutiveHighlightContext.Provider value={accent}>
      <Card className="adb-exec-card">
        <div
          className={cn(
            'adb-exec-accent-bar',
            `adb-exec-accent-bar--${accent}`,
          )}
        />
        <div className="adb-exec-main">{children}</div>
        <ExecutiveHighlightChart series={series} />
      </Card>
    </ExecutiveHighlightContext.Provider>
  )
}

function ExecutiveHighlightHeader({ icon, label }: IExecutiveHighlightHeader) {
  const accent = useContext(ExecutiveHighlightContext)

  return (
    <div className="adb-exec-topline">
      <div className={cn('adb-exec-icon', `adb-exec-icon--${accent}`)}>
        {icon}
      </div>
      <span className="adb-exec-label">{label}</span>
    </div>
  )
}

function ExecutiveHighlightValue({
  trend,
  children,
}: IExecutiveHighlightValue) {
  const badge = TREND_BADGE[trend.direction]

  return (
    <div>
      <div className="adb-exec-value-row">
        <CardTitle className="adb-exec-value">{children}</CardTitle>
        <Badge className={cn('adb-exec-badge', badge.className)}>
          {badge.icon}
          {trend.label}
        </Badge>
      </div>
      <CardDescription className="adb-exec-value-caption">
        vs. período anterior
      </CardDescription>
    </div>
  )
}

function ExecutiveHighlightBody({ children }: IExecutiveHighlightSlot) {
  return <CardHeader className="adb-exec-header">{children}</CardHeader>
}

function ExecutiveHighlightStats({ children }: IExecutiveHighlightSlot) {
  return <CardContent className="adb-exec-stats">{children}</CardContent>
}

function ExecutiveHighlightStat({ label, value }: IExecutiveHighlightStat) {
  return (
    <div className="adb-exec-stat">
      <span className="adb-exec-stat-label">{label}</span>
      <span className="adb-exec-stat-value">{value}</span>
    </div>
  )
}

export const ExecutiveHighlightCard = Object.assign(ExecutiveHighlightRoot, {
  Body: ExecutiveHighlightBody,
  Header: ExecutiveHighlightHeader,
  Value: ExecutiveHighlightValue,
  Stats: ExecutiveHighlightStats,
  Stat: ExecutiveHighlightStat,
})
