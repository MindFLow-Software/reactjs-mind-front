import { FolderOpen, HardDrive, Clock, Archive } from 'lucide-react'
import { MetricCard } from '@/components/metric-card/metric-card'
import { Files } from '@/utils/files'
import type { IAttachmentListMeta } from '@/types/attachment/attachment-list-meta'

type MetricsCardsProps = {
  meta: IAttachmentListMeta
}

export function MetricsCards({ meta }: MetricsCardsProps) {
  const storageLabel =
    meta.totalStorageSize > 0 ? Files.formatSize(meta.totalStorageSize) : '0 B'

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard accentColor="blue">
        <MetricCard.Icon bg="bg-primary/10">
          <FolderOpen className="size-5 text-primary" />
        </MetricCard.Icon>
        <MetricCard.Value>{meta.totalCount}</MetricCard.Value>
        <MetricCard.Label>Total de arquivos</MetricCard.Label>
      </MetricCard>

      <MetricCard accentColor="emerald">
        <MetricCard.Icon bg="bg-success/10">
          <HardDrive className="size-5 text-success" />
        </MetricCard.Icon>
        <MetricCard.Value>{storageLabel}</MetricCard.Value>
        <MetricCard.Label>Armazenamento usado</MetricCard.Label>
      </MetricCard>

      <MetricCard accentColor="amber">
        <MetricCard.Icon bg="bg-warning/10">
          <Clock className="size-5 text-warning" />
        </MetricCard.Icon>
        <MetricCard.Value>—</MetricCard.Value>
        <MetricCard.Label>Pendentes de revisão</MetricCard.Label>
      </MetricCard>

      <MetricCard>
        <MetricCard.Icon bg="bg-muted">
          <Archive className="size-5 text-muted-foreground" />
        </MetricCard.Icon>
        <MetricCard.Value>—</MetricCard.Value>
        <MetricCard.Label>Arquivados (90+ dias)</MetricCard.Label>
      </MetricCard>
    </div>
  )
}
