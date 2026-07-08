import type { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'
import './dashboard-section.css'

interface DashboardSectionProps {
  index?: string
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export function DashboardSection({
  index,
  title,
  description,
  action,
  children,
}: DashboardSectionProps) {
  return (
    <section className="dsh-section-root">
      <div className="dsh-section-header">
        <div>
          <h2 className="dsh-section-title">
            {index && <span className="dsh-section-index">{index} · </span>}
            {title}
          </h2>
          {description && (
            <p className="dsh-section-description">{description}</p>
          )}
        </div>
        {action && <div className="dsh-section-action">{action}</div>}
      </div>

      <Separator className="dsh-section-separator" />

      <div className="dsh-section-content">{children}</div>
    </section>
  )
}
