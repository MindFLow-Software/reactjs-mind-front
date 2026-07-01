'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import {
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Inbox,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Dados mockados para visualização imediata
const MOCK_DATA = {
  paid: 42,
  pending: 12,
  expired: 8,
  canceled: 4,
  refunded: 2,
}

interface TransactionStatusProps {
  data?: {
    pending: number
    expired: number
    paid: number
    canceled: number
    refunded: number
  }
}

// Tooltip customizado seguindo o padrão escuro/premium
// eslint-disable-next-line
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border-none bg-slate-950 p-3 shadow-2xl text-white">
        <p className="font-bold text-[10px] uppercase tracking-widest opacity-70 mb-1">
          {data.label}
        </p>
        <p className="text-xs font-bold">{data.value} transações</p>
      </div>
    )
  }
  return null
}

export function TransactionStatusOverview({
  data = MOCK_DATA,
}: TransactionStatusProps) {
  const totalOrders = Object.values(data).reduce((acc, curr) => acc + curr, 0)

  // Formatação dos dados para o Recharts
  const chartData = [
    { label: 'Pago', value: data.paid, color: '#01DE82', icon: CheckCircle2 },
    { label: 'Pendente', value: data.pending, color: '#f59e0b', icon: Clock },
    {
      label: 'Expirado',
      value: data.expired,
      color: '#ef4444',
      icon: AlertTriangle,
    },
    {
      label: 'Cancelado',
      value: data.canceled,
      color: '#64748b',
      icon: XCircle,
    },
    {
      label: 'Reembolsado',
      value: data.refunded,
      color: '#6366f1',
      icon: RotateCcw,
    },
  ].filter((item) => item.value > 0) // Remove categorias zeradas do gráfico

  return (
    <Card className="rounded-xl bg-card overflow-hidden flex flex-col h-full transition-all duration-300">
      <CardHeader className="p-6 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
            Status das Transações
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Volume de{' '}
            <span className="font-bold text-foreground">{totalOrders}</span>{' '}
            pedidos
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-6 pt-0">
        {totalOrders === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 border-2 border-dashed border-muted/20 rounded-xl bg-muted/5 min-h-[300px]">
            <Inbox className="size-8 text-muted-foreground/20 mb-2" />
            <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
              Sem dados no período
            </span>
          </div>
        ) : (
          <>
            {/* Área do Gráfico */}
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0} // Pizza sólida (mude para 60 para Donut)
                    outerRadius={85}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                    animationDuration={1500}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda Estilizada */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-auto pt-4 border-t border-border/50">
              {chartData.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-black tabular-nums">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
