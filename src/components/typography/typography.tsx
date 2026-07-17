import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import './typography.css'

export function PageTitle({ className, ...props }: ComponentProps<'h1'>) {
  return <h1 className={cn('typ-page-title', className)} {...props} />
}

export function SectionHeader({ className, ...props }: ComponentProps<'h2'>) {
  return <h2 className={cn('typ-section-header', className)} {...props} />
}

export function SectionEyebrow({
  className,
  ...props
}: ComponentProps<'span'>) {
  return <span className={cn('typ-section-eyebrow', className)} {...props} />
}

export function MutedText({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('typ-muted-text', className)} {...props} />
}

export function FieldHint({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('typ-field-hint', className)} {...props} />
}

export function EmptyStateText({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('typ-empty-state-text', className)} {...props} />
}
