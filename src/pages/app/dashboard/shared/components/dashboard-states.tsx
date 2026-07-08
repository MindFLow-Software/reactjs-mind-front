import type { LucideIcon } from 'lucide-react'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import './dashboard-states.css'

type DashboardSkeletonVariant = 'metrics' | 'chart' | 'list' | 'page'

interface DashboardSkeletonProps {
  variant: DashboardSkeletonVariant
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

const SKELETON_VARIANT: Record<DashboardSkeletonVariant, React.FC> = {
  metrics: MetricsSkeleton,
  chart: ChartSkeleton,
  list: ListSkeleton,
  page: PageSkeleton,
}

export function DashboardSkeleton({ variant }: DashboardSkeletonProps) {
  const Variant = SKELETON_VARIANT[variant]
  return <Variant />
}

interface DashboardErrorStateProps {
  message?: string
  onRetry: () => void
}

export function DashboardErrorState({
  message = 'Erro ao carregar dados',
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="dsh-error-state-root">
      <AlertCircle className="dsh-error-state-icon" />
      <p className="dsh-error-state-message">{message}</p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        <RefreshCcw className="size-3.5" />
        Tentar novamente
      </Button>
    </div>
  )
}

interface DashboardEmptyStateAction {
  label: string
  to: string
}

interface DashboardEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: DashboardEmptyStateAction
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: DashboardEmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button asChild size="sm">
            <Link to={action.to}>{action.label}</Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
