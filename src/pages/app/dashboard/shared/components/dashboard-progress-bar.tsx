import { cn } from '@/lib/utils'
import './dashboard-progress-bar.css'

type DashboardProgressBarTone = 'emerald' | 'blue' | 'violet'

interface DashboardProgressBarProps {
  label: string
  value: number
  target: number
  unit?: string
  tone?: DashboardProgressBarTone
}

const TONE_FILL: Record<DashboardProgressBarTone, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-600',
  violet: 'bg-violet-500',
}

export function DashboardProgressBar({
  label,
  value,
  target,
  unit,
  tone = 'emerald',
}: DashboardProgressBarProps) {
  const pct = target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0
  const atGoal = value >= target

  return (
    <div className="dsh-progress-bar-root">
      <div className="dsh-progress-bar-header">
        <span className="dsh-progress-bar-label">{label}</span>
        <span className="dsh-progress-bar-value">
          {value}{' '}
          {unit} / {target}{' '}
          {unit}
        </span>
      </div>
      <div className="dsh-progress-bar-track">
        <div
          className={cn(
            'dsh-progress-bar-fill',
            atGoal ? 'bg-emerald-500' : TONE_FILL[tone],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
