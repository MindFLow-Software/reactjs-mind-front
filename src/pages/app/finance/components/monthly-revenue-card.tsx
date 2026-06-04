'use client'

import { DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface TotalRevenueCardProps {
  revenue: number
}

export const MonthlyRevenueCard = ({ revenue = 0 }: TotalRevenueCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'rounded-xl border bg-card shadow-sm',
        'p-4 transition-all duration-300 hover:shadow-md',
        'border-l-4 border-l-[#01DE82]',
      )}
    >
      <div className="relative z-10 flex flex-col">
        {/* Header idêntico ao de Pacientes */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-green-500/10 p-2 border border-[#01DE82]/20">
            <DollarSign className="size-4 text-[#01DE82]" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Receita Total
            </span>
            <span className="text-xs text-muted-foreground">
              Faturamento bruto mensal
            </span>
          </div>
        </div>

        {/* Divisor Padrão */}
        <Separator className="my-4 bg-transparent border-t-2 border-dashed border-muted-foreground/30" />

        {/* Valor Principal */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
              {formatCurrency(revenue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
