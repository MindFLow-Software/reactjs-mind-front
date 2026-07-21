import {
  CalendarCheck2,
  CheckCircle2,
  DollarSign,
  Timer,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { MetricCard } from '@/components/metric-card/metric-card'
import type { IAccentColor } from '@/components/metric-card/metric-card'

type StatCardData = {
  icon: LucideIcon
  accentColor: IAccentColor
  label: string
  value: React.ReactNode
  footer: React.ReactNode
}

const STAT_CARDS: StatCardData[] = [
  {
    icon: CalendarCheck2,
    accentColor: 'blue',
    label: 'Sessões Realizadas',
    value: '14',
    footer: (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground">
          desde 14/10/2025
        </span>
        <Badge className="h-4 border-0 bg-success/10 px-1.5 text-[10px] font-semibold text-success">
          +3 vs trim. anterior
        </Badge>
      </div>
    ),
  },
  {
    icon: CheckCircle2,
    accentColor: 'emerald',
    label: 'Presença',
    value: (
      <>
        92
        <span className="text-xl font-semibold text-muted-foreground"> %</span>
      </>
    ),
    footer: (
      <span className="text-[11px] text-muted-foreground">
        12 de 13 compromissos
      </span>
    ),
  },
  {
    icon: Timer,
    accentColor: 'amber',
    label: 'Sem Sessão Há',
    value: (
      <>
        42<span className="text-xl font-semibold"> dias</span>
      </>
    ),
    footer: (
      <span className="text-[11px] text-muted-foreground">
        última em 04/04/2026
      </span>
    ),
  },
  {
    icon: DollarSign,
    accentColor: 'emerald',
    label: 'Receita',
    value: (
      <>
        <span className="text-lg font-semibold text-muted-foreground">R$ </span>
        2.520
      </>
    ),
    footer: (
      <span className="text-[11px] text-muted-foreground">
        acumulado · R$ 180/sessão
      </span>
    ),
  },
]

export function ResumeStatCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map((card) => (
        <MetricCard
          key={card.label}
          variant="stacked"
          accentColor={card.accentColor}
        >
          <MetricCard.Header
            icon={<card.icon className="size-4" />}
            label={card.label}
            accentColor={card.accentColor}
          />
          <MetricCard.Value>{card.value}</MetricCard.Value>
          <div className="mt-2">{card.footer}</div>
        </MetricCard>
      ))}
    </div>
  )
}
