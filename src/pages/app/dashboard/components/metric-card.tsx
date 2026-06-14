import { AlertCircle, RefreshCcw, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type AccentColor = 'blue' | 'violet' | 'emerald'

const GRADIENT: Record<AccentColor, string> = {
  blue: 'from-blue-400 to-blue-600',
  violet: 'from-violet-400 to-violet-600',
  emerald: 'from-emerald-400 to-emerald-600',
}

const ICON_RING: Record<AccentColor, string> = {
  blue: 'bg-blue-500/10 ring-blue-500/20',
  violet: 'bg-violet-500/10 ring-violet-500/20',
  emerald: 'bg-emerald-500/10 ring-emerald-500/20',
}

interface MetricCardHeader {
  label: string
  icon: React.ReactNode
}

interface MetricCardState {
  isLoading: boolean
  isError?: boolean
  onRetry?: () => void
}

interface MetricCardRootProps {
  accentColor: AccentColor
  header: MetricCardHeader
  state: MetricCardState
  children: React.ReactNode
}

function MetricCardRoot({ accentColor, header, state, children }: MetricCardRootProps) {
  return (
    <Card className="relative overflow-hidden rounded-lg bg-card p-5">
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r',
          GRADIENT[accentColor],
        )}
      />
      <div className="flex items-center gap-3">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1', ICON_RING[accentColor])}>
          {header.icon}
        </div>
        <p className="text-sm font-semibold text-foreground leading-tight">{header.label}</p>
      </div>
      <div className="mt-3">
        {state.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-5 w-36" />
          </div>
        ) : state.isError ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="size-4" />
              <span className="text-sm">Erro ao carregar</span>
            </div>
            {state.onRetry && (
              <button
                onClick={state.onRetry}
                className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline"
              >
                <RefreshCcw className="size-3" /> Tentar novamente
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  )
}

function MetricCardValue({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-4xl font-bold tabular-nums text-foreground">{children}</p>
  )
}

interface MetricCardTrendProps {
  direction: 'up' | 'down'
  label: string
  children: React.ReactNode
}

function MetricCardTrend({ direction, label, children }: MetricCardTrendProps) {
  const isUp = direction === 'up'
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold',
          isUp
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        )}
      >
        {isUp ? (
          <TrendingUp className="size-3" />
        ) : (
          <TrendingDown className="size-3" />
        )}
        {children}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

interface MetricCardProgressProps {
  value: number
  atGoal: boolean
  label: string
}

function MetricCardProgress({ value, atGoal, label }: MetricCardProgressProps) {
  return (
    <>
      <div className="mt-2 flex items-center gap-1.5">
        <Minus
          className={cn('size-3', atGoal ? 'text-green-500' : 'text-muted-foreground')}
        />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            atGoal ? 'bg-emerald-500' : 'bg-emerald-400',
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </>
  )
}

export const MetricCard = Object.assign(MetricCardRoot, {
  Value: MetricCardValue,
  Trend: MetricCardTrend,
  Progress: MetricCardProgress,
})
