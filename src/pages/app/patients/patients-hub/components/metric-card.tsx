'use client'

import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface MetricCardProps {
  title: string
  value: number | string
  subValue?: string | number
  subLabel?: string
  // eslint-disable-next-line
  icon?: any
  isLoading?: boolean
}

export function MetricCard({
  title,
  value,
  subValue,
  subLabel,
  icon: Icon = Activity,
  isLoading = false,
}: MetricCardProps) {
  return (
    <Card className="shadow-sm border-l-4 border-l-blue-500 bg-blue-50/5 transition-all hover:bg-blue-50/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] uppercase text-muted-foreground flex items-center gap-2 font-bold tracking-wider">
          <Icon className="h-3 w-3 text-blue-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            {subValue !== undefined && (
              <p className="text-[10px] text-muted-foreground mt-1">
                {subLabel}:{' '}
                <span className="font-medium text-foreground">
                  {subValue}min
                </span>
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
