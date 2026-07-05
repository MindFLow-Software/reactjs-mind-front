import type { ReactNode } from 'react'
import {
  CalendarCheck2,
  CheckCircle2,
  DollarSign,
  Timer,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardData {
  icon: LucideIcon
  iconColor: string
  borderColor: string
  label: string
  value: ReactNode
  footer: ReactNode
  valueClassName?: string
}

function StatCard({ card }: { card: StatCardData }) {
  const { icon: Icon, iconColor, borderColor, label, value, footer } = card

  return (
    <Card className={cn('border-l-4', borderColor)}>
      <CardContent className="prt-stat-body">
        <p className={cn('prt-stat-label', iconColor)}>
          <Icon className="prt-stat-icon" />
          {label}
        </p>
        <div className={cn('prt-stat-value', card.valueClassName)}>{value}</div>
        <div className="prt-stat-footer">{footer}</div>
      </CardContent>
    </Card>
  )
}

const STAT_CARDS: StatCardData[] = [
  {
    icon: CalendarCheck2,
    iconColor: 'text-blue-600',
    borderColor: 'border-l-blue-500',
    label: 'Sessões Realizadas',
    value: '14',
    footer: (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground">
          desde 14/10/2025
        </span>
        <Badge className="h-4 border-0 bg-green-100 px-1.5 text-[10px] font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
          +3 vs trim. anterior
        </Badge>
      </div>
    ),
  },
  {
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    borderColor: 'border-l-green-500',
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
    iconColor: 'text-amber-600',
    borderColor: 'border-l-amber-500',
    label: 'Sem Sessão Há',
    valueClassName: 'text-amber-500 dark:text-amber-400',
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
    iconColor: 'text-emerald-600',
    borderColor: 'border-l-emerald-500',
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
    <div className="prt-stats-grid">
      {STAT_CARDS.map((card) => (
        <StatCard key={card.label} card={card} />
      ))}
    </div>
  )
}
