import { cn } from '@/lib/utils'
import { getFileMimeGroup, MIME_GRADIENT } from '@/utils/file-helpers'

interface FileThumbProps {
  type: string
}

export function FileThumb({ type }: FileThumbProps) {
  const group = getFileMimeGroup(type)
  return (
    <div className={cn('pd-up-thumb', MIME_GRADIENT[group])}>
      <span className="pd-up-thumb-ext">{group}</span>
    </div>
  )
}
