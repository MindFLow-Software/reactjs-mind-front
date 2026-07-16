import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

import './active-badge.css'

type IActiveBadge = {
  isActive: boolean
}

export function ActiveBadge({ isActive }: IActiveBadge) {
  return (
    <Badge className={cn(isActive ? 'ab-badge-active' : 'ab-badge-inactive')}>
      <span
        className={cn('ab-dot', isActive ? 'ab-dot-active' : 'ab-dot-inactive')}
      />
      {isActive ? 'Ativo' : 'Inativo'}
    </Badge>
  )
}
