'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Activity, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import './metric-card.css'

interface MetricCardProps {
  title: string
  value: number | string
  subValue?: string | number
  subLabel?: string
  icon?: LucideIcon
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
    <Card className="ph-metric-card">
      <CardHeader className="ph-metric-card__header">
        <CardTitle className="ph-metric-card__title">
          <Icon className="ph-metric-card__icon" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="ph-metric-card__skeleton-wrap">
            <Skeleton className="ph-metric-card__skeleton--value" />
            <Skeleton className="ph-metric-card__skeleton--sub" />
          </div>
        ) : (
          <>
            <p className="ph-metric-card__value">{value}</p>
            {subValue !== undefined && (
              <p className="ph-metric-card__sub">
                {subLabel}:{' '}
                <span className="ph-metric-card__sub-value">{subValue}min</span>
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
