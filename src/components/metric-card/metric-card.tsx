import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import {
  Inbox,
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

import { Button } from '@/components/ui/button'
import { IconBox } from '@/components/icon-box/icon-box'
import { Skeleton } from '@/components/ui/skeleton'

import './metric-card.css'

type IMetricCardVariant = 'grid' | 'stacked'
type IAccentColor = 'blue' | 'violet' | 'emerald'

type IMetricCardState = {
  isLoading?: boolean
  isError?: boolean
  isEmpty?: boolean
}

type IMetricCardContext = {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  variant: IMetricCardVariant
}

const MetricCardContext = createContext<IMetricCardContext>({
  isLoading: false,
  isError: false,
  isEmpty: false,
  variant: 'grid',
})

const TREND_ELEMENT = {
  up: {
    element: <TrendingUp className="size-4 text-success" />,
    style: 'text-success bg-success/15',
  },
  neutral: {
    element: <TrendingUpDown className="size-4 text-muted-foreground" />,
    style: 'text-muted-foreground',
  },
  down: {
    element: <TrendingDown className="size-4 text-destructive" />,
    style: 'text-destructive bg-destructive/15',
  },
}

const GRADIENT: Record<IAccentColor, string> = {
  blue: 'from-primary to-primary/50',
  violet: 'from-accent-primary-light to-accent-primary-light/50',
  emerald: 'from-success to-success/50',
}

const ICON_RING: Record<IAccentColor, string> = {
  blue: 'bg-primary/10 ring-primary/20',
  violet: 'bg-accent-primary-light/10 ring-accent-primary-light/20',
  emerald: 'bg-success/10 ring-success/20',
}

type IMetricCardRoot = {
  variant?: IMetricCardVariant
  isLoading?: boolean
  state?: IMetricCardState
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

type IMetricCardError = {
  message?: string
  onRetry?: () => void
}

type IMetricCardEmpty = {
  icon?: LucideIcon
  message?: string
}

function MetricCardRoot({
  variant = 'grid',
  isLoading = false,
  state,
  accentColor,
  children,
  className,
  size = 'fill',
}: IMetricCardRoot) {
  const contextValue: IMetricCardContext = {
    isLoading: state?.isLoading ?? isLoading,
    isError: state?.isError ?? false,
    isEmpty: state?.isEmpty ?? false,
    variant,
  }

  return (
    <MetricCardContext.Provider value={contextValue}>
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
            atGoal ? 'text-success' : 'text-muted-foreground',
          )}
        />
        <span className="mc-trend-label">{label}</span>
      </div>
      <div className="mc-progress-track">
        <div
          className={cn(
            'mc-progress-fill',
            atGoal ? 'bg-success' : 'bg-success/60',
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
  const { isError: contextError } = useContext(MetricCardContext)

  if (!isError && !contextError) {
    return <>{children}</>
  }

  return (
    <div className="mc-body-error">
      <div className="mc-body-error-row">
        <AlertCircle className="size-4" />
        <span className="text-sm">Erro ao carregar</span>
      </div>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RefreshCcw data-icon="inline-start" />
          Tentar novamente
        </Button>
      )}
    </div>
  )
}

function MetricCardError({
  message = 'Erro ao carregar',
  onRetry,
}: IMetricCardError) {
  const { isError } = useContext(MetricCardContext)

  if (!isError) {
    return null
  }

  return (
    <div className="mc-state">
      <IconBox icon={AlertCircle} variant="destructive" size="sm" />
      <p className="mc-state-text">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCcw data-icon="inline-start" />
          Tentar novamente
        </Button>
      )}
    </div>
  )
}

function MetricCardEmpty({
  icon = Inbox,
  message = 'Sem dados',
}: IMetricCardEmpty) {
  const { isEmpty } = useContext(MetricCardContext)

  if (!isEmpty) {
    return null
  }

  return (
    <div className="mc-state">
      <IconBox icon={icon} variant="muted" size="sm" />
      <p className="mc-state-text">{message}</p>
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
  Error: MetricCardError,
  Empty: MetricCardEmpty,
})
