import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import './finance-stat-card.css'

type FinanceStatAccent = 'indigo' | 'green' | 'amber'

type FinanceStatCardProps = {
  icon: ReactNode
  accent: FinanceStatAccent
  header: { title: string; subtitle: string }
  value: string
  suffix?: string
}

export function FinanceStatCard({
  icon,
  accent,
  header,
  value,
  suffix,
}: FinanceStatCardProps) {
  return (
    <div className={cn('fin-stat-card', `fin-stat-card--${accent}`)}>
      <div className="fin-stat-header">
        <div className={cn('fin-stat-icon', `fin-stat-icon--${accent}`)}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="fin-stat-title">{header.title}</span>
          <span className="fin-stat-subtitle">{header.subtitle}</span>
        </div>
      </div>

      <Separator className="fin-stat-separator" />

      <div className="flex items-baseline gap-2">
        <span className="fin-stat-value">{value}</span>
        {suffix && <span className="fin-stat-value-suffix">{suffix}</span>}
      </div>
    </div>
  )
}
