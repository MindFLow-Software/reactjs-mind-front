import './context-status-pill.css'

import { cn } from '@/lib/utils'

interface ContextStatusPillProps {
  isActive: boolean
}

export function ContextStatusPill({ isActive }: ContextStatusPillProps) {
  return (
    <span
      className={cn(
        'ca-status-pill',
        isActive
          ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-500',
      )}
    >
      <span
        className={cn(
          'ca-status-dot',
          isActive ? 'bg-green-600' : 'bg-amber-500',
        )}
      />
      {isActive ? 'Ativo' : 'Pausado'}
    </span>
  )
}
