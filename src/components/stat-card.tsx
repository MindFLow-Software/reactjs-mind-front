import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: ReactNode
  iconBg: string
  value: string | number
  label: string
  trend?: string
  trendClass?: string
  className?: string
}

export function StatCard({
  icon,
  iconBg,
  value,
  label,
  trend,
  trendClass = 'text-emerald-600',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4',
        className,
      )}
    >
      <div
        className={cn(
          'size-11 rounded-lg flex items-center justify-center shrink-0',
          iconBg,
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1.5">{label}</p>
        {trend && (
          <p className={cn('text-[11px] font-semibold mt-1', trendClass)}>
            {trend}
          </p>
        )}
      </div>
    </div>
  )
}
