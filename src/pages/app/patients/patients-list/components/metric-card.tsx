import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MetricCardProps } from '../patients-list.types'

export function MetricCard({ icon, iconBg, value, label, sub, subTrend, isLoading }: MetricCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm">
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', iconBg)}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        {isLoading ? (
          <div className="h-7 w-12 animate-pulse rounded bg-muted" />
        ) : (
          <span className="text-2xl font-bold tabular-nums leading-none">{value}</span>
        )}
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {sub && (
          <span className={cn(
            'text-[11px] font-medium flex items-center gap-1',
            subTrend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
          )}>
            {subTrend === 'up' && <ArrowUp className="h-3 w-3" />}
            {sub}
          </span>
        )}
      </div>
    </div>
  )
}
