import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

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
        'flex size-10 shrink-0 items-center justify-center rounded-md',
        variant === 'primary'
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
          : 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400',
        className,
      )}
    >
      {children}
    </div>
  )
}
