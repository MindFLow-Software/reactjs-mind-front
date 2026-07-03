import { FolderOpen, HardDrive, Clock, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/utils/format-file-size'
import type { AttachmentListMeta } from '@/api/attachments/attachments'
import './metrics-cards.css'

interface MetricCardProps {
  icon: React.ReactNode
  iconBg: string
  value: string | number
  label: string
  sub?: string
}

function MetricCard({ icon, iconBg, value, label, sub }: MetricCardProps) {
  return (
    <div className="pd-metric-card">
      <div className={cn('pd-metric-icon', iconBg)}>{icon}</div>
      <div className="pd-metric-body">
        <span className="pd-metric-value">{value}</span>
        <span className="pd-metric-label">{label}</span>
        {sub && <span className="pd-metric-sub">{sub}</span>}
      </div>
    </div>
  )
}

interface MetricsCardsProps {
  meta: AttachmentListMeta
}

export function MetricsCards({ meta }: MetricsCardsProps) {
  const storageLabel =
    meta.totalStorageSize > 0 ? formatFileSize(meta.totalStorageSize) : '0 B'

  return (
    <div className="pd-metric-grid">
      <MetricCard
        icon={<FolderOpen className="size-5 text-blue-600" />}
        iconBg="bg-blue-500/10"
        value={meta.totalCount}
        label="Total de arquivos"
      />
      <MetricCard
        icon={<HardDrive className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-500/10"
        value={storageLabel}
        label="Armazenamento usado"
      />
      <MetricCard
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-500/10"
        value="—"
        label="Pendentes de revisão"
      />
      <MetricCard
        icon={<Archive className="size-5 text-muted-foreground" />}
        iconBg="bg-muted"
        value="—"
        label="Arquivados (90+ dias)"
      />
    </div>
  )
}
