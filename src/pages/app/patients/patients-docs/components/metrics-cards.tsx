import { FolderOpen, HardDrive, Clock, Archive } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatFileSize } from "@/utils/format-file-size"
import type { AttachmentListMeta } from "@/api/attachments/attachments"

interface MetricCardProps {
    icon:   React.ReactNode
    iconBg: string
    value:  string | number
    label:  string
    sub?:   string
}

function MetricCard({ icon, iconBg, value, label, sub }: MetricCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", iconBg)}>
                {icon}
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold tabular-nums leading-none">{value}</span>
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
                {sub && <span className="text-[11px] text-muted-foreground font-medium">{sub}</span>}
            </div>
        </div>
    )
}

interface MetricsCardsProps {
    meta: AttachmentListMeta
}

export function MetricsCards({ meta }: MetricsCardsProps) {
    const storageLabel = meta.totalStorageSize > 0 ? formatFileSize(meta.totalStorageSize) : "0 B"

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 pt-2 pb-0">
            <MetricCard
                icon={<FolderOpen className="h-5 w-5 text-blue-600" />}
                iconBg="bg-blue-500/10"
                value={meta.totalCount}
                label="Total de arquivos"
            />
            <MetricCard
                icon={<HardDrive className="h-5 w-5 text-emerald-600" />}
                iconBg="bg-emerald-500/10"
                value={storageLabel}
                label="Armazenamento usado"
            />
            <MetricCard
                icon={<Clock className="h-5 w-5 text-amber-600" />}
                iconBg="bg-amber-500/10"
                value="—"
                label="Pendentes de revisão"
            />
            <MetricCard
                icon={<Archive className="h-5 w-5 text-slate-500" />}
                iconBg="bg-slate-500/10"
                value="—"
                label="Arquivados (90+ dias)"
            />
        </div>
    )
}
