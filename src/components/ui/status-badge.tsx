import { ArrowDownToLine, Ban, Check, Clock } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { AccountStatus } from '@/types/auth'

export type { AccountStatus }

const STATUS_CONFIG: Record<
  AccountStatus,
  {
    label: string
    bg: string
    fg: string
    ico: string
    Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  }
> = {
  ACTIVE: {
    label: 'Ativo',
    bg: 'bg-green-100',
    fg: 'text-green-800',
    ico: 'bg-green-600',
    Icon: Check,
  },
  PENDING: {
    label: 'Avaliação',
    bg: 'bg-amber-100',
    fg: 'text-amber-800',
    ico: 'bg-amber-600',
    Icon: Clock,
  },
  REJECTED: {
    label: 'Rejeitado',
    bg: 'bg-red-100',
    fg: 'text-red-800',
    ico: 'bg-red-600',
    Icon: Ban,
  },
  BLOCKED: {
    label: 'Inativo',
    bg: 'bg-cyan-100',
    fg: 'text-cyan-800',
    ico: 'bg-cyan-600',
    Icon: ArrowDownToLine,
  },
}

interface StatusBadgeProps {
  status: AccountStatus
  size?: 'sm' | 'md'
  className?: string
}

export function StatusBadge({
  status,
  size = 'sm',
  className,
}: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.Icon
  const isMd = size === 'md'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-2.5 py-0.5 font-semibold leading-tight whitespace-nowrap',
        isMd ? 'text-sm' : 'text-xs',
        cfg.bg,
        cfg.fg,
        className,
      )}
    >
      <span
        className={cn(
          'grid place-items-center rounded-full text-white shrink-0',
          cfg.ico,
          isMd ? 'w-4 h-4' : 'w-3.5 h-3.5',
        )}
      >
        <Icon className={isMd ? 'w-3 h-3' : 'w-2.5 h-2.5'} strokeWidth={3.2} />
      </span>
      {cfg.label}
    </span>
  )
}
