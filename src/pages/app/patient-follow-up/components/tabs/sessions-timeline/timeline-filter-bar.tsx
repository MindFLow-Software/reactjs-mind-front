import { CalendarDays, ListFilter, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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
      <div className="pst-search-wrapper">
        <Search className="pst-search-icon" />
        <Input
          placeholder="Buscar nas anotações..."
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          className="pst-search-input"
        />
      </div>

      <div className="pst-chips-row">
        {CHIPS.map((chip) => {
          const active = status.value === chip.key
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => status.onChange(chip.key)}
              className={cn(
                'pst-chip',
                active ? 'pst-chip--active' : 'pst-chip--inactive',
              )}
            >
              {chip.label}
              <span
                className={cn(
                  'pst-chip-count',
                  active
                    ? 'pst-chip-count--active'
                    : 'pst-chip-count--inactive',
                )}
              >
                {status.counts[chip.key]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="pst-filter-actions">
        <Button variant="outline" size="sm" className="pst-filter-btn">
          <CalendarDays className="pst-filter-btn-icon" />
          Período: 6 meses
        </Button>
        <Button variant="outline" size="sm" className="pst-filter-btn">
          <ListFilter className="pst-filter-btn-icon" />
          Ordenar
        </Button>
      </div>
    </div>
  )
}
