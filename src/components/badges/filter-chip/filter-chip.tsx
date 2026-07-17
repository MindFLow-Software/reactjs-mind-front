import type { ReactNode } from 'react'

import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

import './filter-chip.css'

type IFilterChipProps = {
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
}: IFilterChipProps) {
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
