import { cn } from '@/lib/utils'

import './dashboard-progress-bar.css'

type IDashboardProgressBarTone = 'emerald' | 'blue' | 'violet'

export type IDashboardProgressBarMetric = {
  value: number
  target: number
  unit?: string
}

type IDashboardProgressBar = {
  label: string
  metric: IDashboardProgressBarMetric
  tone?: IDashboardProgressBarTone
}

const TONE_FILL: Record<IDashboardProgressBarTone, string> = {
  emerald: 'bg-success',
  blue: 'bg-accent-blue',
  violet: 'bg-accent-primary-light',
}

export function DashboardProgressBar({
  label,
  metric,
  tone = 'emerald',
}: IDashboardProgressBar) {
  const { value, target, unit } = metric
  const pct = target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0
  const atGoal = value >= target

  return (
    <div className="dsh-progress-bar-root">
      <div className="dsh-progress-bar-header">
        <span className="dsh-progress-bar-label">{label}</span>
        <span className="dsh-progress-bar-value">
          {value} {unit} / {target} {unit}
        </span>
      </div>
      <div className="dsh-progress-bar-track">
        <div
          className={cn(
            'dsh-progress-bar-fill',
            atGoal ? 'bg-success' : TONE_FILL[tone],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
