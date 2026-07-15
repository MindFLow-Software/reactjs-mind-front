import { cn } from '@/lib/utils'
import { PERIODS } from '@/pages/app/dashboard/shared/constants'
import type {
  IDashboardPeriod,
  IPeriodOption,
} from '@/pages/app/dashboard/shared/types'

import './dashboard-period-selector.css'

type IDashboardPeriodSelector = {
  value: IDashboardPeriod
  onChange: (period: IDashboardPeriod) => void
  options?: readonly IPeriodOption[]
}

export function DashboardPeriodSelector({
  value,
  onChange,
  options = PERIODS,
}: IDashboardPeriodSelector) {
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
