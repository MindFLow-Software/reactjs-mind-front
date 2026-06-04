'use client'

import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface PendingPaymentsCardProps {
  amount: number
}

export const PendingPaymentsCard = ({
  amount = 0,
}: PendingPaymentsCardProps) => {
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
        'border-l-4 border-l-[#f59e0b]', // Cor âmbar para atenção/pendência
      )}
    >
      <div className="relative z-10 flex flex-col">
        {/* Header Padronizado */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[#f59e0b]/10 p-2 border border-[#f59e0b]/20">
            <AlertCircle className="size-4 text-[#f59e0b]" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
              A Receber
            </span>
            <span className="text-xs text-muted-foreground">
              Pagamentos pendentes
            </span>
          </div>
        </div>

        {/* Divisor Padrão */}
        <Separator className="my-4 bg-transparent border-t-2 border-dashed border-muted-foreground/30" />

        {/* Valor Principal */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
              {formatCurrency(amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
