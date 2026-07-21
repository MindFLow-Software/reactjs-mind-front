import { Skeleton } from '@/components/ui/skeleton'

import './anamnesis-skeleton.css'

export function AnamnesisSkeleton() {
  return (
    <div className="ph-anamnesis-skeleton">
      <div className="ph-anamnesis-skeleton__header">
        <div className="ph-anamnesis-skeleton__header-text">
          <Skeleton className="ph-anamnesis-skeleton__sk-title" />
          <Skeleton className="ph-anamnesis-skeleton__sk-subtitle" />
        </div>
        <div className="ph-anamnesis-skeleton__header-actions">
          <Skeleton className="ph-anamnesis-skeleton__sk-action-sm" />
          <Skeleton className="ph-anamnesis-skeleton__sk-action-md" />
        </div>
      </div>

      <div className="ph-anamnesis-skeleton__card">
        <div className="ph-anamnesis-skeleton__nav">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="ph-anamnesis-skeleton__sk-nav-tab" />
          ))}
        </div>

        <div className="ph-anamnesis-skeleton__editor-section">
          <div className="ph-anamnesis-skeleton__editor-header">
            <Skeleton className="ph-anamnesis-skeleton__sk-label" />
            <Skeleton className="ph-anamnesis-skeleton__sk-btn" />
          </div>

          <div className="ph-anamnesis-skeleton__editor-body">
            <Skeleton className="ph-anamnesis-skeleton__sk-toolbar" />
            <Skeleton className="ph-anamnesis-skeleton__sk-editor" />
          </div>
        </div>
      </div>
    </div>
  )
}
