import type { ReactNode } from 'react'

import { MetricCard } from '@/components/metric-card/metric-card'

type FinanceStatAccent = 'indigo' | 'green' | 'amber'

const ACCENT_MAP: Record<FinanceStatAccent, 'violet' | 'emerald' | 'amber'> = {
  indigo: 'violet',
  green: 'emerald',
  amber: 'amber',
}

type FinanceStatCardProps = {
  icon: ReactNode
  accent: FinanceStatAccent
  header: { title: string; subtitle: string }
  value: string
  suffix?: string
}

export function FinanceStatCard({
  icon,
  accent,
  header,
  value,
  suffix,
}: FinanceStatCardProps) {
  const accentColor = ACCENT_MAP[accent]

  return (
    <MetricCard variant="stacked" accentColor={accentColor}>
      <MetricCard.Header
        icon={icon}
        label={header.title}
        subtitle={header.subtitle}
        accentColor={accentColor}
      />
      <MetricCard.Value>
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {suffix}
          </span>
        )}
      </MetricCard.Value>
    </MetricCard>
  )
}
