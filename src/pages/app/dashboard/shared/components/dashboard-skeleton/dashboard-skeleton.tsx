import type { FC } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import './dashboard-skeleton.css'

type IDashboardSkeletonVariant = 'metrics' | 'chart' | 'list' | 'page'

type IDashboardSkeleton = {
  variant: IDashboardSkeletonVariant
}

function MetricsSkeleton() {
  return (
    <div className="dsh-skeleton-metrics-grid">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="dsh-skeleton-metric-card" />
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="dsh-skeleton-chart" />
}

function ListSkeleton() {
  return (
    <div className="dsh-skeleton-list">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="dsh-skeleton-list-row" />
      ))}
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="dsh-skeleton-page">
      <Skeleton className="dsh-skeleton-page-header" />
      <MetricsSkeleton />
      <ChartSkeleton />
    </div>
  )
}

const SKELETON_VARIANT: Record<IDashboardSkeletonVariant, FC> = {
  metrics: MetricsSkeleton,
  chart: ChartSkeleton,
  list: ListSkeleton,
  page: PageSkeleton,
}

export function DashboardSkeleton({ variant }: IDashboardSkeleton) {
  const Variant = SKELETON_VARIANT[variant]
  return <Variant />
}
