import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

import './stat-card.css'

export type IStatCardData = {
  icon: ReactNode
  iconBg: string
  value: string | number
  label: string
  trend?: string
  trendClass?: string
}

type IStatCard = {
  data: IStatCardData
  className?: string
}

export function StatCard({ data, className }: IStatCard) {
  const {
    icon,
    iconBg,
    value,
    label,
    trend,
    trendClass = 'text-emerald-600',
  } = data

  return (
    <Card className={cn('sc-card', className)}>
      <div className={cn('sc-icon', iconBg)}>{icon}</div>
      <div>
        <p className="sc-value">{value}</p>
        <p className="sc-label">{label}</p>
        {trend && <p className={cn('sc-trend', trendClass)}>{trend}</p>}
      </div>
    </Card>
  )
}
