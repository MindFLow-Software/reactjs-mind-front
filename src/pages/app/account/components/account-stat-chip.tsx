import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

import './account-stat-chip.css'

type AccountStatChipAccent = 'blue' | 'indigo' | 'purple' | 'neutral'

interface IAccountStatChip {
  icon: ReactNode
  accent: AccountStatChipAccent
  label: string
  value: string
}

export function AccountStatChip({
  icon,
  accent,
  label,
  value,
}: IAccountStatChip) {
  return (
    <div className={cn('acc-chip', `acc-chip--${accent}`)}>
      <div className={cn('acc-chip-icon', `acc-chip-icon--${accent}`)}>
        {icon}
      </div>
      <div className="min-w-0">
        <span className={cn('acc-chip-label', `acc-chip-label--${accent}`)}>
          {label}
        </span>
        <span className="acc-chip-value">{value}</span>
      </div>
    </div>
  )
}
