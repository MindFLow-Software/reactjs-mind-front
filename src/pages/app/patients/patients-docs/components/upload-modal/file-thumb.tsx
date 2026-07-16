import { cn } from '@/lib/utils'
import { Files } from '@/utils/files'
import './file-thumb.css'

type FileThumbProps = {
  type: string
}

export function FileThumb({ type }: FileThumbProps) {
  const group = Files.mimeGroup(type)
  return (
    <div className={cn('pd-up-thumb', Files.MIME_GRADIENT[group])}>
      <span className="pd-up-thumb-ext">{group}</span>
    </div>
  )
}
