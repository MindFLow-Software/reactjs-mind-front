import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import './stats-card.css'

export type ISuggestionMiniStat = {
  label: string
  value: string
  Icon: LucideIcon
}

type IStatsCard = {
  stats: ISuggestionMiniStat[]
}

export function StatsCard({ stats }: IStatsCard) {
  return (
    <div className="sdm-card sdm-stats-card">
      <div className="sdm-stats-grid">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              'sdm-stat',
              index % 2 === 0 && 'sdm-stat-divider-right',
              index < 2 && 'sdm-stat-divider-bottom',
            )}
          >
            <div className="sdm-stat-head">
              <stat.Icon className="size-3" />
              <span className="sdm-stat-label">{stat.label}</span>
            </div>
            <p className="sdm-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
