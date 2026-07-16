'use client'

import { cn } from '@/lib/utils'
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
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'sfc-chip',
        isActive ? 'sfc-chip--active' : 'sfc-chip--default',
      )}
    >
      {data.dot && (
        <span className={cn('size-2 rounded-full shrink-0', data.dot)} />
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
    </button>
  )
}
