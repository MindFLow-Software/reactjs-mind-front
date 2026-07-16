import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type IDashboardEmptyStateContent = {
  icon: LucideIcon
  title: string
  description: string
}

type IDashboardEmptyStateAction = {
  label: string
  to: string
}

type IDashboardEmptyState = {
  content: IDashboardEmptyStateContent
  action?: IDashboardEmptyStateAction
}

export function DashboardEmptyState({ content, action }: IDashboardEmptyState) {
  const Icon = content.icon

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{content.title}</EmptyTitle>
        <EmptyDescription>{content.description}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button asChild size="sm">
            <Link to={action.to}>{action.label}</Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
