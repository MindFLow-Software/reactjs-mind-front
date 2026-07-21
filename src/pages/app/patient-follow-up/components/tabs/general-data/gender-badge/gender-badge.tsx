import { Mars, Venus, Equal } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Gender } from '@/types/shared/enums'

import './gender-badge.css'

type IGenderBadge = {
  gender: Gender
}

const GENDER_BADGE_MAP: Record<
  Gender,
  { label: string; icon: React.ReactNode; className: string }
> = {
  MASCULINE: {
    label: 'Masculino',
    icon: <Mars className="size-3" />,
    className: 'gb-badge--masculine',
  },
  FEMININE: {
    label: 'Feminino',
    icon: <Venus className="size-3" />,
    className: 'gb-badge--feminine',
  },
  OTHER: {
    label: 'Outro',
    icon: <Equal className="size-3" />,
    className: 'gb-badge--other',
  },
}

export function GenderBadge({ gender }: IGenderBadge) {
  const { label, icon, className } = GENDER_BADGE_MAP[gender]

  return (
    <span className={cn('gb-badge', className)}>
      {icon} {label}
    </span>
  )
}
