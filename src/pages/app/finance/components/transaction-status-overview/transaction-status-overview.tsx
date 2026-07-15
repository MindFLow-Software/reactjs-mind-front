'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from 'recharts'
import type {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent'
import {
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Inbox,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import './transaction-status-overview.css'

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

interface TransactionStatusDatum {
  label: string
  value: number
  color: string
}

function CustomTooltip({ active, payload }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload as TransactionStatusDatum

  return (
    <div className="fin-status-tooltip">
      <p className="fin-status-tooltip-label">{data.label}</p>
      <p className="fin-status-tooltip-value">{data.value} transações</p>
    </div>
  )
}

export function TransactionStatusOverview({
  data = MOCK_DATA,
}: TransactionStatusProps) {
  const totalOrders = Object.values(data).reduce((acc, curr) => acc + curr, 0)

  const chartData = [
    {
      label: 'Pago',
      value: data.paid,
      color: 'var(--finance-paid)',
      icon: CheckCircle2,
    },
    {
      label: 'Pendente',
      value: data.pending,
      color: 'var(--finance-pending)',
      icon: Clock,
    },
    {
      label: 'Expirado',
      value: data.expired,
      color: 'var(--finance-expired)',
      icon: AlertTriangle,
    },
    {
      label: 'Cancelado',
      value: data.canceled,
      color: 'var(--finance-canceled)',
      icon: XCircle,
    },
    {
      label: 'Reembolsado',
      value: data.refunded,
      color: 'var(--finance-refunded)',
      icon: RotateCcw,
    },
  ].filter((item) => item.value > 0)

  return (
    <Card className="fin-status-card">
      <CardHeader className="p-6 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="fin-status-title">
            Status das Transações
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Volume de{' '}
            <span className="font-bold text-foreground">{totalOrders}</span>{' '}
            pedidos
          </p>
        </div>
      </CardHeader>

      <CardContent className="fin-status-content">
        {totalOrders === 0 ? (
          <div className="fin-status-empty">
            <Inbox className="mb-2 size-8 text-muted-foreground/20" />
            <span className="fin-status-empty-label">Sem dados no período</span>
          </div>
        ) : (
          <>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={85}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="white"
                    strokeWidth={2}
                    animationDuration={1500}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="fin-status-cell"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="fin-status-legend">
              {chartData.map((item) => (
                <div key={item.label} className="fin-status-legend-item group">
                  <div className="flex items-center gap-2">
                    <div
                      className="fin-status-legend-dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="fin-status-legend-label">
                      {item.label}
                    </span>
                  </div>
                  <span className="fin-status-legend-value">{item.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
