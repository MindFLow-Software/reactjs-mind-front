import './patients-metrics.css'
import { Activity, Clock, UsersRound, UserRoundPlus } from 'lucide-react'
import type { ElementType } from 'react'

import { MetricCard } from '@/components/metric-card/metric-card'
import type { IPatientsMetricCounts } from '../../patients-list.types'

type IPatientsMetrics = {
  counts: IPatientsMetricCounts
  state: { isLoadingTotal: boolean; isLoadingMetrics: boolean }
}

type IMetricTile = {
  key: keyof IPatientsMetricCounts
  icon: ElementType
  iconBg: string
  iconClassName: string
  label: string
  trend?: string
}

const METRIC_TILES: readonly IMetricTile[] = [
  {
    key: 'totalCount',
    icon: UsersRound,
    iconBg: 'bg-blue-500/10',
    iconClassName: 'size-6 text-blue-600',
    label: 'Total de pacientes',
  },
  {
    key: 'activeCount',
    icon: Activity,
    iconBg: 'bg-emerald-500/10',
    iconClassName: 'size-6 text-emerald-600',
    label: 'Ativos',
    trend: '24%',
  },
  {
    key: 'archivedCount',
    icon: Clock,
    iconBg: 'bg-red-500/10',
    iconClassName: 'size-6 text-red-500',
    label: 'Arquivados',
  },
  {
    key: 'newPatientsCount',
    icon: UserRoundPlus,
    iconBg: 'bg-violet-500/10',
    iconClassName: 'size-6 text-violet-600',
    label: 'Novos (30 dias)',
    trend: '24%',
  },
]

export function PatientsMetrics({ counts, state }: IPatientsMetrics) {
  return (
    <div className="pme-grid">
      {METRIC_TILES.map((tile) => {
        const Icon = tile.icon
        const isLoading =
          tile.key === 'totalCount'
            ? state.isLoadingTotal
            : state.isLoadingMetrics

        return (
          <MetricCard key={tile.key} isLoading={isLoading}>
            <MetricCard.Icon bg={tile.iconBg}>
              <Icon className={tile.iconClassName} />
            </MetricCard.Icon>
            <MetricCard.Value>{counts[tile.key]}</MetricCard.Value>
            <MetricCard.Label>{tile.label}</MetricCard.Label>
            {tile.trend && (
              <MetricCard.Trend direction="up">{tile.trend}</MetricCard.Trend>
            )}
          </MetricCard>
        )
      })}
    </div>
  )
}
