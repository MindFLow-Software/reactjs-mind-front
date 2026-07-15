import type { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'

import './dashboard-section.css'

export type IDashboardSectionHeader = {
  index?: string
  title: string
  description?: string
}

type IDashboardSection = {
  header: IDashboardSectionHeader
  children: ReactNode
}

export function DashboardSection({ header, children }: IDashboardSection) {
  return (
    <section className="dsh-section-root">
      <div className="dsh-section-header">
        <div>
          <h2 className="dsh-section-title">
            {header.index && (
              <span className="dsh-section-index">{header.index} · </span>
            )}
            {header.title}
          </h2>
          {header.description && (
            <p className="dsh-section-description">{header.description}</p>
          )}
        </div>
      </div>

      <Separator className="dsh-section-separator" />

      <div className="dsh-section-content">{children}</div>
    </section>
  )
}
