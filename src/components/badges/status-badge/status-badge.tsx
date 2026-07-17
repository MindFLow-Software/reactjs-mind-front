import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import './status-badge.css'

export type IStatusBadgeTone =
  | 'success'
  | 'warning'
  | 'destructive'
  | 'muted'
  | 'primary'
  | 'gender-feminine'
  | 'gender-masculine'
  | 'gender-other'

type IStatusBadgeProps = {
  tone: IStatusBadgeTone
  label: string
  className?: string
}

const TONE_CLASS: Record<IStatusBadgeTone, string> = {
  success: 'sb-tone-success',
  warning: 'sb-tone-warning',
  destructive: 'sb-tone-destructive',
  muted: 'sb-tone-muted',
  primary: 'sb-tone-primary',
  'gender-feminine': 'sb-tone-gender-feminine',
  'gender-masculine': 'sb-tone-gender-masculine',
  'gender-other': 'sb-tone-gender-other',
}

export function StatusBadge({ tone, label, className }: IStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[tone], className)}>
      {label}
    </Badge>
  )
}
