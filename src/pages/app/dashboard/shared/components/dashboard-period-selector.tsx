import { cn } from '@/lib/utils'
import { PERIODS } from '../constants'
import type { DashboardPeriod, PeriodOption } from '../types'
import './dashboard-period-selector.css'

interface DashboardPeriodSelectorProps {
  value: DashboardPeriod
  onChange: (period: DashboardPeriod) => void
  options?: readonly PeriodOption[]
}

export function DashboardPeriodSelector({
  value,
  onChange,
  options = PERIODS,
}: DashboardPeriodSelectorProps) {
  return (
    <div className="dsh-period-selector-root">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'dsh-period-selector-btn',
            value === option.value && 'dsh-period-selector-btn--active',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
