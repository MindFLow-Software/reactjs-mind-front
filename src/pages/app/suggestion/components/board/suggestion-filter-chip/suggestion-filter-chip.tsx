import { cn } from '@/lib/utils'
import { FilterChip } from '@/components/badges/filter-chip/filter-chip'

import './suggestion-filter-chip.css'

type ISuggestionFilterChipData = {
  label: string
  count: number
  dot?: string
}

type ISuggestionFilterChip = {
  data: ISuggestionFilterChipData
  isActive: boolean
  onClick: () => void
}

export function SuggestionFilterChip({
  data,
  isActive,
  onClick,
}: ISuggestionFilterChip) {
  return (
    <FilterChip active={isActive} onToggle={onClick} className="sfc-chip">
      {data.dot && (
        <span className={cn('size-2 shrink-0 rounded-full', data.dot)} />
      )}
      {data.label}
      <span
        className={cn(
          'sfc-count',
          isActive ? 'sfc-count--active' : 'sfc-count--default',
        )}
      >
        {data.count}
      </span>
    </FilterChip>
  )
}
