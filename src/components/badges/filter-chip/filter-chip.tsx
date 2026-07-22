import type { ReactNode } from 'react'

import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

import './filter-chip.css'

type IFilterChip = {
  active: boolean
  onToggle: () => void
  children: ReactNode
  className?: string
}

export function FilterChip({
  active,
  onToggle,
  children,
  className,
}: IFilterChip) {
  return (
    <Toggle
      pressed={active}
      onPressedChange={onToggle}
      variant="outline"
      size="sm"
      className={cn('fc-root', className)}
    >
      {children}
    </Toggle>
  )
}
