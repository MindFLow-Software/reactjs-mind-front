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

import './metric-card.css'

type IMetricCardVariant = 'grid' | 'stacked'
type IAccentColor = 'blue' | 'violet' | 'emerald'

type IMetricCardContext = {
  isLoading: boolean
  variant: IMetricCardVariant
}

const MetricCardContext = createContext<IMetricCardContext>({
  isLoading: false,
  variant: 'grid',
})

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

const GRADIENT: Record<IAccentColor, string> = {
  blue: 'from-blue-600 to-blue-400',
  violet: 'from-violet-600 to-violet-400',
  emerald: 'from-emerald-600 to-emerald-400',
}

const ICON_RING: Record<IAccentColor, string> = {
  blue: 'bg-blue-500/10 ring-blue-500/20',
  violet: 'bg-violet-500/10 ring-violet-500/20',
  emerald: 'bg-emerald-500/10 ring-emerald-500/20',
}

type IMetricCardRoot = {
  variant?: IMetricCardVariant
  isLoading?: boolean
  accentColor?: IAccentColor
  children: ReactNode
  className?: string
  size?: 'md' | 'fill'
}

type IMetricCardIcon = {
  bg: string
  children: ReactNode
}

type IMetricCardHeader = {
  icon: ReactNode
  label: string
  accentColor: IAccentColor
}

type IMetricCardValue = {
  children: ReactNode
}

type IMetricCardLabel = {
  children: ReactNode
}

type IMetricCardTrend = {
  direction: 'up' | 'neutral' | 'down'
  label?: string
  children: ReactNode
}

type IMetricCardProgress = {
  value: number
  atGoal: boolean
  label: string
}

type IMetricCardBody = {
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
  size = 'fill',
}: IMetricCardRoot) {
  return (
    <MetricCardContext.Provider value={{ isLoading, variant }}>
      <Card
        className={cn(
          'mc-card',
          variant === 'grid' ? 'mc-card-grid' : 'mc-card-stacked',
          size === 'md' && 'mc-card-md',
          className,
        )}
      >
        {accentColor && (
          <div className={cn('mc-accent-bar', GRADIENT[accentColor])} />
        )}
        <CardContent
          className={cn(
            'mc-content',
            variant === 'grid' && 'mc-content-grid',
            variant === 'stacked' && 'mc-content-stacked',
          )}
        >
          {children}
        </CardContent>
      </Card>
    </MetricCardContext.Provider>
  )
}

function MetricCardIcon({ bg, children }: IMetricCardIcon) {
  return <div className={cn('mc-icon', bg)}>{children}</div>
}

function MetricCardHeader({ icon, label, accentColor }: IMetricCardHeader) {
  return (
    <CardHeader className="mc-header">
      <div className={cn('mc-header-icon', ICON_RING[accentColor])}>{icon}</div>
      <p className="mc-header-label">{label}</p>
    </CardHeader>
  )
}

function MetricCardValue({ children }: IMetricCardValue) {
  const { isLoading, variant } = useContext(MetricCardContext)

  if (isLoading) {
    return (
      <Skeleton
        className={
          variant === 'stacked'
            ? 'mc-value-skeleton-stacked'
            : 'mc-value-skeleton'
        }
      />
    )
  }

  return (
    <CardTitle
      className={cn(
        'mc-value',
        variant === 'stacked' ? 'mc-value-stacked' : 'mc-value-grid',
      )}
    >
      {children}
    </CardTitle>
  )
}

function MetricCardLabel({ children }: IMetricCardLabel) {
  return <CardDescription className="mc-label">{children}</CardDescription>
}

function MetricCardTrend({ direction, label, children }: IMetricCardTrend) {
  const { variant } = useContext(MetricCardContext)

  if (variant === 'stacked') {
    const isUp = direction === 'up'
    return (
      <div className="mc-trend-stacked">
        <span
          className={cn(
            'mc-trend-badge',
            isUp ? 'mc-trend-up' : 'mc-trend-down',
          )}
        >
          {isUp ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {children}
        </span>
        {label && <span className="mc-trend-label">{label}</span>}
      </div>
    )
  }

  const trend = TREND_ELEMENT[direction]

  return (
    <CardAction className={cn('mc-trend-action', trend.style)}>
      {trend.element}
      <span>{children}</span>
    </CardAction>
  )
}

function MetricCardProgress({ value, atGoal, label }: IMetricCardProgress) {
  const { isLoading } = useContext(MetricCardContext)

  if (isLoading) {
    return (
      <div className="mc-progress-loading">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mc-progress-loading-bar" />
      </div>
    )
  }

  return (
    <>
      <div className="mc-progress-row">
        <Minus
          className={cn(
            'size-3',
            atGoal ? 'text-green-500' : 'text-muted-foreground',
          )}
        />
        <span className="mc-trend-label">{label}</span>
      </div>
      <div className="mc-progress-track">
        <div
          className={cn(
            'mc-progress-fill',
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
}: IMetricCardBody) {
  if (!isError) return <>{children}</>

  return (
    <div className="mc-body-error">
      <div className="mc-body-error-row">
        <AlertCircle className="size-4" />
        <span className="text-sm">Erro ao carregar</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="mc-retry-btn">
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
