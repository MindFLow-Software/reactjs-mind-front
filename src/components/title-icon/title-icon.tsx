import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import './title-icon.css'

type ITitleIcon = ComponentProps<'div'> & {
  variant?: 'primary' | 'secondary'
}

export function TitleIcon({
  children,
  variant = 'primary',
  className,
  ...props
}: ITitleIcon) {
  return (
    <div
      {...props}
      className={cn(
        'ti-root',
        variant === 'primary' ? 'ti-primary' : 'ti-secondary',
        className,
      )}
    >
      {children}
    </div>
  )
}
