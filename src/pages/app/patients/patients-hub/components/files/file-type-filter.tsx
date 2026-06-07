import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

interface FileTypeFilterProps {
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
        {CHIPS.map((chip) => {
          const active = filter === chip.key
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => onFilterChange(chip.key)}
              className={cn(
                'ph-file-type-filter__chip',
                active && 'ph-file-type-filter__chip--active',
              )}
            >
              {chip.label}
              <span
                className={cn(
                  'ph-file-type-filter__count',
                  active && 'ph-file-type-filter__count--active',
                )}
              >
                {counts[chip.key]}
              </span>
            </button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="ph-file-type-filter__sort-btn"
        tabIndex={-1}
      >
        <ArrowUpDown className="ph-file-type-filter__sort-icon" />
        Mais recentes
      </Button>
    </div>
  )
}
