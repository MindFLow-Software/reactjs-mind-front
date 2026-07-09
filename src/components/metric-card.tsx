import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import {
  Minus,
  RefreshCcw,
  TrendingUp,
  AlertCircle,
  TrendingDown,
  TrendingUpDown,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Card,
  CardTitle,
  CardAction,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

interface MetricCardContextValue {
  isLoading: boolean
  variant: MetricCardVariant
}

const MetricCardContext = createContext<MetricCardContextValue>({
  isLoading: false,
  variant: 'grid',
})

type MetricCardVariant = 'grid' | 'stacked'
type AccentColor = 'blue' | 'violet' | 'emerald'

const TREND_ELEMENT = {
  up: {
    element: (
      <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
    ),
    style: 'text-emerald-600 dark:text-emerald-400 bg-green-300/25',
  },
  neutral: {
    element: <TrendingUpDown className="size-4 text-muted-foreground" />,
    style: 'text-muted-foreground',
  },
  down: {
    element: <TrendingDown className="size-4 text-red-600 dark:text-red-400" />,
    style: 'text-red-600 dark:text-red-400 bg-red-300/25',
  },
}

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

interface MetricCardRootProps {
  variant?: MetricCardVariant
  isLoading?: boolean
  accentColor?: AccentColor
  children: ReactNode
  className?: string
  size?: 'md' | 'fill'
}

interface MetricCardIconProps {
  bg: string
  children: ReactNode
}

interface MetricCardHeaderProps {
  icon: ReactNode
  label: string
  accentColor: AccentColor
}

interface MetricCardValueProps {
  children: ReactNode
}

interface MetricCardLabelProps {
  children: ReactNode
}

interface MetricCardTrendProps {
  direction: 'up' | 'neutral' | 'down'
  label?: string
  children: ReactNode
}

interface MetricCardProgressProps {
  value: number
  atGoal: boolean
  label: string
}

interface MetricCardBodyProps {
  isError?: boolean
  onRetry?: () => void
  children: ReactNode
}

function MetricCardRoot({
  variant = 'grid',
  isLoading = false,
  accentColor,
  children,
  className,
  size = 'fill'
}: MetricCardRootProps) {
  return (
    <MetricCardContext.Provider value={{ isLoading, variant }}>
      <Card
        className={cn(
          'relative rounded-md border bg-card shadow-sm min-h-36 max-h-40 w-full',
          variant === 'grid' ? 'px-6 py-5' : 'p-5',
          size === 'md' && 'max-w-80 shrink-0',
          className,
        )}
      >
        {accentColor && (
          <div
            className={cn(
              'absolute inset-x-0 top-0 h-1 bg-linear-to-r',
              GRADIENT[accentColor],
            )}
          />
        )}
        <CardContent
          className={cn(
            'relative px-0',
            variant === 'grid' &&
              'grid grid-cols-[48px_1fr] items-start gap-x-4 gap-y-1',
            variant === 'stacked' && 'flex flex-col',
          )}
        >
          {children}
        </CardContent>
      </Card>
    </MetricCardContext.Provider>
  )
}

function MetricCardIcon({ bg, children }: MetricCardIconProps) {
  return (
    <div
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-full row-span-2',
        bg,
      )}
    >
      {children}
    </div>
  )
}

function MetricCardHeader({ icon, label, accentColor }: MetricCardHeaderProps) {
  return (
    <CardHeader className="flex items-center gap-3 p-0">
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full ring-1',
          ICON_RING[accentColor],
        )}
      >
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground leading-tight">
        {label}
      </p>
    </CardHeader>
  )
}

function MetricCardValue({ children }: MetricCardValueProps) {
  const { isLoading, variant } = useContext(MetricCardContext)

  if (isLoading) {
    return (
      <Skeleton
        className={variant === 'stacked' ? 'mt-3 h-9 w-24' : 'h-8 w-14'}
      />
    )
  }

  return (
    <CardTitle
      className={cn(
        'font-bold tabular-nums leading-none',
        variant === 'stacked' ? 'mt-3 text-2xl' : 'text-xl',
      )}
    >
      {children}
    </CardTitle>
  )
}

function MetricCardLabel({ children }: MetricCardLabelProps) {
  return (
    <CardDescription className="text-sm text-muted-foreground font-medium">
      {children}
    </CardDescription>
  )
}

function MetricCardTrend({ direction, label, children }: MetricCardTrendProps) {
  const { variant } = useContext(MetricCardContext)

  if (variant === 'stacked') {
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
        {label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    )
  }

  const trend = TREND_ELEMENT[direction]

  return (
    <CardAction
      className={cn(
        'absolute -top-1 -right-2 text-xs font-medium flex items-center gap-1.5 rounded-4xl px-1 py-0.5',
        trend.style,
      )}
    >
      {trend.element}
      <span>{children}</span>
    </CardAction>
  )
}

function MetricCardProgress({ value, atGoal, label }: MetricCardProgressProps) {
  const { isLoading } = useContext(MetricCardContext)

  if (isLoading) {
    return (
      <div className="mt-2 flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    )
  }

  return (
    <>
      <div className="mt-2 flex items-center gap-1.5">
        <Minus
          className={cn(
            'size-3',
            atGoal ? 'text-green-500' : 'text-muted-foreground',
          )}
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

function MetricCardBody({
  isError = false,
  onRetry,
  children,
}: MetricCardBodyProps) {
  if (!isError) return <>{children}</>

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-red-500">
        <AlertCircle className="size-4" />
        <span className="text-sm">Erro ao carregar</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline"
        >
          <RefreshCcw className="size-3" /> Tentar novamente
        </button>
      )}
    </div>
  )
}

export const MetricCard = Object.assign(MetricCardRoot, {
  Icon: MetricCardIcon,
  Header: MetricCardHeader,
  Value: MetricCardValue,
  Label: MetricCardLabel,
  Trend: MetricCardTrend,
  Progress: MetricCardProgress,
  Body: MetricCardBody,
})
