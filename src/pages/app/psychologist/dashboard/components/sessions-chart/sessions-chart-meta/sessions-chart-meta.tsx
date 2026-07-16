import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'

import type { IChartCardSeries } from '@/components/chart-card/chart-card'
import { cn } from '@/lib/utils'

import type { ISessionsStats, ISessionsVolumePoint } from '../types'

import './sessions-chart-meta.css'

enum GrowthTone {
  UP = 'UP',
  DOWN = 'DOWN',
  FLAT = 'FLAT',
}

const GROWTH_ICON: Record<GrowthTone, LucideIcon> = {
  [GrowthTone.UP]: TrendingUp,
  [GrowthTone.DOWN]: TrendingDown,
  [GrowthTone.FLAT]: Minus,
}

const GROWTH_CLASS: Record<GrowthTone, string> = {
  [GrowthTone.UP]: 'dsh-sessions-growth-up',
  [GrowthTone.DOWN]: 'dsh-sessions-growth-down',
  [GrowthTone.FLAT]: 'dsh-sessions-growth-flat',
}

function getGrowthTone(value: number): GrowthTone {
  if (value > 0) return GrowthTone.UP
  if (value < 0) return GrowthTone.DOWN
  return GrowthTone.FLAT
}

type IGrowthBadge = {
  value: number
}

function GrowthBadge({ value }: IGrowthBadge) {
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

type ISessionsChartMeta = {
  stats: ISessionsStats
  series: readonly IChartCardSeries<ISessionsVolumePoint>[]
}

export function SessionsChartMeta({ stats, series }: ISessionsChartMeta) {
  return (
    <div className="dsh-sessions-meta">
      <div className="dsh-sessions-stats">
        <div className="dsh-sessions-stat">
          <span className="dsh-sessions-stat-label">Crescimento</span>
          <GrowthBadge value={stats.growthPercent} />
        </div>
        <div className="dsh-sessions-stat">
          <span className="dsh-sessions-stat-label">Média diária</span>
          <span className="dsh-sessions-stat-value">{stats.dailyAverage}</span>
        </div>
      </div>

      <div className="dsh-sessions-legend">
        {series.map(({ dataKey, color, label }) => (
          <div key={dataKey} className="dsh-sessions-legend-item">
            <span
              className="dsh-sessions-legend-dot"
              style={{ backgroundColor: color }}
            />
            <span className="dsh-sessions-legend-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
