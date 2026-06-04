import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp, TrendingUpDown } from 'lucide-react'

import {
  Card,
  CardTitle,
  CardAction,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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

interface MetricCardContext {
  isLoading: boolean
}

const MetricCardContext = createContext<MetricCardContext>({ isLoading: false })

interface MetricCardRootProps {
  isLoading?: boolean
  children: ReactNode
  className?: string
}

interface MetricCardIconProps {
  bg: string
  children: ReactNode
}

interface MetricCardValueProps {
  children: ReactNode
}

interface MetricCardLabelProps {
  children: ReactNode
}

interface MetricCardTrendProps {
  direction: 'up' | 'neutral' | 'down'
  children: ReactNode
}

function MetricCardRoot({
  isLoading = false,
  children,
  className,
}: MetricCardRootProps) {
  return (
    <MetricCardContext.Provider value={{ isLoading }}>
      <Card
        className={cn(
          'rounded-md border bg-card px-5 py-4 shadow-sm',
          className,
        )}
      >
        <CardContent className="relative grid grid-cols-[40px_1fr] gap-x-4 gap-y-0.5 items-start px-0">
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
        'flex size-10 shrink-0 items-center justify-center rounded-full row-span-2',
        bg,
      )}
    >
      {children}
    </div>
  )
}

function MetricCardValue({ children }: MetricCardValueProps) {
  const { isLoading } = useContext(MetricCardContext)

  if (isLoading) return <Skeleton className="h-7 w-12" />

  return (
    <CardTitle className="text-2xl font-bold tabular-nums leading-none">
      {children}
    </CardTitle>
  )
}

function MetricCardLabel({ children }: MetricCardLabelProps) {
  return (
    <CardDescription className="text-xs text-muted-foreground font-medium">
      {children}
    </CardDescription>
  )
}

function MetricCardTrend({ direction, children }: MetricCardTrendProps) {
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

export const MetricCard = Object.assign(MetricCardRoot, {
  Icon: MetricCardIcon,
  Value: MetricCardValue,
  Label: MetricCardLabel,
  Trend: MetricCardTrend,
})
