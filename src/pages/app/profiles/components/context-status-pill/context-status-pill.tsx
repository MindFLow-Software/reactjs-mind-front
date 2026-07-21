import './context-status-pill.css'

import { cn } from '@/lib/utils'

type IContextStatusPill = {
  isActive: boolean
}

export function ContextStatusPill({ isActive }: IContextStatusPill) {
  return (
    <span
      className={cn(
        'ca-status-pill',
        isActive
          ? 'bg-success/10 text-success dark:bg-success/20 dark:text-success'
          : 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning',
      )}
    >
      <span
        className={cn('ca-status-dot', isActive ? 'bg-success' : 'bg-warning')}
      />
      {isActive ? 'Ativo' : 'Pausado'}
    </span>
  )
}
