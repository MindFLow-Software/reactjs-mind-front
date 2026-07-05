import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

export interface StatCardData {
  icon: ReactNode
  iconBg: string
  value: string | number
  label: string
  trend?: string
  trendClass?: string
}

interface StatCardProps {
  data: StatCardData
  className?: string
}

export function StatCard({ data, className }: StatCardProps) {
  const {
    icon,
    iconBg,
    value,
    label,
    trend,
    trendClass = 'text-emerald-600',
  } = data

  return (
    <Card
      className={cn(
        'flex-row items-center gap-4 rounded-xl border border-border px-5 py-4',
        className,
      )}
    >
      <div
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-lg',
          iconBg,
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>
        {trend && (
          <p className={cn('mt-1 text-[11px] font-semibold', trendClass)}>
            {trend}
          </p>
        )}
      </div>
    </Card>
  )
}
