import { CalendarDays, ListFilter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/form-fields/search-input/search-input'
import { FilterChip } from '@/components/badges/filter-chip/filter-chip'

import { CHIPS, type SessionStatusFilter } from './timeline.helpers'

type ITimelineFilterBar = {
  search: {
    value: string
    onChange: (value: string) => void
  }
  status: {
    value: SessionStatusFilter
    onChange: (value: SessionStatusFilter) => void
    counts: Record<string, number>
  }
}

export function TimelineFilterBar({ search, status }: ITimelineFilterBar) {
  return (
    <div className="pst-filter-bar">
      <SearchInput
        placeholder="Buscar nas anotações..."
        value={search.value}
        onChange={search.onChange}
        className="pst-search-input"
      />

      <div className="pst-chips-row">
        {CHIPS.map((chip) => (
          <FilterChip
            key={chip.key}
            active={status.value === chip.key}
            onToggle={() => status.onChange(chip.key)}
          >
            {chip.label}
            <span className="pst-chip-count">{status.counts[chip.key]}</span>
          </FilterChip>
        ))}
      </div>

      <div className="pst-filter-actions">
        <Button variant="outline" size="sm" className="pst-filter-btn">
          <CalendarDays data-icon="inline-start" />
          Período: 6 meses
        </Button>
        <Button variant="outline" size="sm" className="pst-filter-btn">
          <ListFilter data-icon="inline-start" />
          Ordenar
        </Button>
      </div>
    </div>
  )
}
