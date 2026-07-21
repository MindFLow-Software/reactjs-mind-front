import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
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
  function handleValueChange(next: string) {
    if (next) {
      onChange(next as IDashboardPeriod)
    }
  }

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={handleValueChange}
      variant="outline"
      size="sm"
      className="dsh-period-selector-root"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="dsh-period-selector-item"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
