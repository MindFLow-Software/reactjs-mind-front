import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'

type IActiveBadge = {
  isActive: boolean
}

export function ActiveBadge({ isActive }: IActiveBadge) {
  return (
    <Badge
      className={cn(
        isActive
          ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
          : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full shrink-0',
          isActive ? 'bg-green-500' : 'bg-red-400',
        )}
      />
      {isActive ? 'Ativo' : 'Inativo'}
    </Badge>
  )
}
