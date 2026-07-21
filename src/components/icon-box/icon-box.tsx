import type { LucideIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import './icon-box.css'

const iconBoxVariants = cva('ib-root', {
  variants: {
    variant: {
      default: 'ib-variant-default',
      primary: 'ib-variant-primary',
      success: 'ib-variant-success',
      warning: 'ib-variant-warning',
      destructive: 'ib-variant-destructive',
      muted: 'ib-variant-muted',
    },
    size: {
      sm: 'ib-size-sm',
      md: 'ib-size-md',
      lg: 'ib-size-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type IIconBoxSize = NonNullable<VariantProps<typeof iconBoxVariants>['size']>

const ICON_SIZE_CLASS: Record<IIconBoxSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
}

type IIconBoxProps = {
  icon: LucideIcon
  variant?: VariantProps<typeof iconBoxVariants>['variant']
  size?: IIconBoxSize
  className?: string
}

export function IconBox({
  icon: Icon,
  variant,
  size = 'md',
  className,
}: IIconBoxProps) {
  return (
    <div className={cn(iconBoxVariants({ variant, size }), className)}>
      <Icon className={ICON_SIZE_CLASS[size]} />
    </div>
  )
}
