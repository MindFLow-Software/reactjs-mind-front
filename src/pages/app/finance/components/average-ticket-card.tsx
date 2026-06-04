'use client'

import { BarChartHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface AverageTicketCardProps {
  value: number
}

export const AverageTicketCard = ({ value = 0 }: AverageTicketCardProps) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'rounded-xl border bg-card shadow-sm',
        'p-4 transition-all duration-300 hover:shadow-md',
        'border-l-4 border-l-[#6366f1]', // Cor Indigo para métricas de performance
      )}
    >
      <div className="relative z-10 flex flex-col">
        {/* Header Padronizado */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[#6366f1]/10 p-2 border border-[#6366f1]/20">
            <BarChartHorizontal className="size-4 text-[#6366f1]" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Ticket Médio
            </span>
            <span className="text-xs text-muted-foreground">
              Valor médio por atendimento
            </span>
          </div>
        </div>

        {/* Divisor Padrão */}
        <Separator className="my-4 bg-transparent border-t-2 border-dashed border-muted-foreground/30" />

        {/* Valor Principal */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
              {formatCurrency(value)}
            </span>
            <span className="text-xs font-medium text-muted-foreground lowercase">
              por sessão
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
