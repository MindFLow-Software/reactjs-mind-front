import { FolderOpen, HardDrive, Clock, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Files } from '@/utils/files'
import type { IAttachmentListMeta } from '@/types/attachment/attachment-list-meta'
import './metrics-cards.css'

function MetricCardIcon({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('pd-metric-icon', className)}>{children}</div>
}

function MetricCardValue({ children }: { children: React.ReactNode }) {
  return <span className="pd-metric-value">{children}</span>
}

function MetricCardLabel({ children }: { children: React.ReactNode }) {
  return <span className="pd-metric-label">{children}</span>
}

function MetricCardSub({ children }: { children: React.ReactNode }) {
  return <span className="pd-metric-sub">{children}</span>
}

function MetricCardRoot({ children }: { children: React.ReactNode }) {
  return <div className="pd-metric-card">{children}</div>
}

export const MetricCard = Object.assign(MetricCardRoot, {
  Icon: MetricCardIcon,
  Value: MetricCardValue,
  Label: MetricCardLabel,
  Sub: MetricCardSub,
})

interface MetricsCardsProps {
  meta: IAttachmentListMeta
}

export function MetricsCards({ meta }: MetricsCardsProps) {
  const storageLabel =
    meta.totalStorageSize > 0 ? Files.formatSize(meta.totalStorageSize) : '0 B'

  return (
    <div className="pd-metric-grid">
      <MetricCard>
        <MetricCard.Icon className="bg-blue-500/10">
          <FolderOpen className="size-5 text-blue-600" />
        </MetricCard.Icon>
        <div className="pd-metric-body">
          <MetricCard.Value>{meta.totalCount}</MetricCard.Value>
          <MetricCard.Label>Total de arquivos</MetricCard.Label>
        </div>
      </MetricCard>

      <MetricCard>
        <MetricCard.Icon className="bg-emerald-500/10">
          <HardDrive className="size-5 text-emerald-600" />
        </MetricCard.Icon>
        <div className="pd-metric-body">
          <MetricCard.Value>{storageLabel}</MetricCard.Value>
          <MetricCard.Label>Armazenamento usado</MetricCard.Label>
        </div>
      </MetricCard>

      <MetricCard>
        <MetricCard.Icon className="bg-amber-500/10">
          <Clock className="size-5 text-amber-600" />
        </MetricCard.Icon>
        <div className="pd-metric-body">
          <MetricCard.Value>—</MetricCard.Value>
          <MetricCard.Label>Pendentes de revisão</MetricCard.Label>
        </div>
      </MetricCard>

      <MetricCard>
        <MetricCard.Icon className="bg-muted">
          <Archive className="size-5 text-muted-foreground" />
        </MetricCard.Icon>
        <div className="pd-metric-body">
          <MetricCard.Value>—</MetricCard.Value>
          <MetricCard.Label>Arquivados (90+ dias)</MetricCard.Label>
        </div>
      </MetricCard>
    </div>
  )
}
