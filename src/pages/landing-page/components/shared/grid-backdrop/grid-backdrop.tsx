import { cn } from '@/lib/utils'
import './grid-backdrop.css'

interface GridBackdropProps {
  className?: string
}

export function GridBackdrop({ className }: GridBackdropProps) {
  return <div className={cn('lp-grid-backdrop', className)} />
}
