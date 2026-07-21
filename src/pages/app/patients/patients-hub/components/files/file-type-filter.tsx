import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterChip } from '@/components/badges/filter-chip/filter-chip'

import './file-type-filter.css'

export type FileTypeFilter = 'all' | 'pdf' | 'image' | 'audio'

export function getFileType(mime: string): Exclude<FileTypeFilter, 'all'> {
  if (mime.includes('pdf')) return 'pdf'
  if (mime.includes('image')) return 'image'
  if (mime.includes('audio')) return 'audio'
  return 'pdf'
}

const CHIPS: { key: FileTypeFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pdf', label: 'PDFs' },
  { key: 'image', label: 'Imagens' },
  { key: 'audio', label: 'Áudios' },
]

type FileTypeFilterProps = {
  filter: FileTypeFilter
  counts: Record<FileTypeFilter, number>
  onFilterChange: (f: FileTypeFilter) => void
}

export function FileTypeFilter({
  filter,
  counts,
  onFilterChange,
}: FileTypeFilterProps) {
  return (
    <div className="ph-file-type-filter">
      <div className="ph-file-type-filter__chips">
        {CHIPS.map((chip) => (
          <FilterChip
            key={chip.key}
            active={filter === chip.key}
            onToggle={() => onFilterChange(chip.key)}
          >
            {chip.label}
            <span className="ph-file-type-filter__count">
              {counts[chip.key]}
            </span>
          </FilterChip>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="ph-file-type-filter__sort-btn"
        tabIndex={-1}
      >
        <ArrowUpDown data-icon="inline-start" />
        Mais recentes
      </Button>
    </div>
  )
}
