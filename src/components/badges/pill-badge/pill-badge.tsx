import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import './pill-badge.css'

type IPillBadgeVariant = 'default' | 'primary' | 'muted'

type IPillBadgeProps = {
  variant?: IPillBadgeVariant
  className?: string
  children: ReactNode
}

const VARIANT_CLASS: Record<IPillBadgeVariant, string> = {
  default: 'pb-variant-default',
  primary: 'pb-variant-primary',
  muted: 'pb-variant-muted',
}

export function PillBadge({
  variant = 'default',
  className,
  children,
}: IPillBadgeProps) {
  return (
    <Badge variant="outline" className={cn(VARIANT_CLASS[variant], className)}>
      {children}
    </Badge>
  )
}
