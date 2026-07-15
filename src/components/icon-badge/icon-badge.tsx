import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import './icon-badge.css'

export enum IconBadgeTone {
  BLUE = 'BLUE',
  VIOLET = 'VIOLET',
  EMERALD = 'EMERALD',
  AMBER = 'AMBER',
}

const TONE_CLASS: Record<IconBadgeTone, string> = {
  [IconBadgeTone.BLUE]: 'ib-blue',
  [IconBadgeTone.VIOLET]: 'ib-violet',
  [IconBadgeTone.EMERALD]: 'ib-emerald',
  [IconBadgeTone.AMBER]: 'ib-amber',
}

type IIconBadge = {
  tone: IconBadgeTone
  children: ReactNode
}

export function IconBadge({ tone, children }: IIconBadge) {
  return <span className={cn('ib-root', TONE_CLASS[tone])}>{children}</span>
}
