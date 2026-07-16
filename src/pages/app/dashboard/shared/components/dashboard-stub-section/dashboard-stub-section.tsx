import type { ReactNode } from 'react'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import './dashboard-stub-section.css'

type IDashboardStubSectionHeader = {
  icon: ReactNode
  title: string
}

type IDashboardStubSectionState = {
  isEmpty: boolean
  emptyText: string
}

type IDashboardStubSection = {
  header: IDashboardStubSectionHeader
  state: IDashboardStubSectionState
  className?: string
}

export function DashboardStubSection({
  header,
  state,
  className,
}: IDashboardStubSection) {
  return (
    <Card className={cn('dsh-stub-card', className)}>
      <CardHeader className="dsh-stub-header">
        {header.icon}
        <CardTitle className="dsh-stub-title">{header.title}</CardTitle>
      </CardHeader>

      {state.isEmpty && (
        <p className="dsh-stub-empty-text">{state.emptyText}</p>
      )}
    </Card>
  )
}
