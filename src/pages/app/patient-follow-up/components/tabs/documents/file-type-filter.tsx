import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import './file-type-filter.css'

export enum FileType {
  ALL = 'all',
  PDF = 'pdf',
  IMAGE = 'image',
  AUDIO = 'audio',
}

export function getFileType(mime: string): Exclude<FileType, FileType.ALL> {
  if (mime.includes('pdf')) return FileType.PDF
  if (mime.includes('image')) return FileType.IMAGE
  if (mime.includes('audio')) return FileType.AUDIO
  return FileType.PDF
}

const CHIPS: { key: FileType; label: string }[] = [
  { key: FileType.ALL, label: 'Todos' },
  { key: FileType.PDF, label: 'PDFs' },
  { key: FileType.IMAGE, label: 'Imagens' },
  { key: FileType.AUDIO, label: 'Áudios' },
]

type IFileTypeFilter = {
  filter: FileType
  counts: Record<FileType, number>
  onFilterChange: (f: FileType) => void
}

export function FileTypeFilter({
  filter,
  counts,
  onFilterChange,
}: IFileTypeFilter) {
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
