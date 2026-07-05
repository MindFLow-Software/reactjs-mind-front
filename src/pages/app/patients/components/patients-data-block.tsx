import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface PatientsDataBlockRootProps {
  children: ReactNode
  className?: string
}

interface PatientsDataBlockHeaderProps {
  title?: ReactNode
  description?: ReactNode
  isLoading?: boolean
  children?: ReactNode
}

interface PatientsDataBlockToolbarProps {
  children: ReactNode
}

interface PatientsDataBlockContentProps {
  children: ReactNode
  className?: string
}

interface PatientsDataBlockFooterProps {
  children: ReactNode
}

function PatientsDataBlockRoot({
  children,
  className,
}: PatientsDataBlockRootProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      {children}
    </section>
  )
}

function PatientsDataBlockHeader({
  title,
  description,
  isLoading,
  children,
}: PatientsDataBlockHeaderProps) {
  if (!title && !description && !children && !isLoading) return null

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          title && (
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          )
        )}
        {description && !isLoading && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      )}
    </header>
  )
}

function PatientsDataBlockToolbar({ children }: PatientsDataBlockToolbarProps) {
  return <div>{children}</div>
}

function PatientsDataBlockContent({
  children,
  className,
}: PatientsDataBlockContentProps) {
  return <div className={cn('w-full', className)}>{children}</div>
}

function PatientsDataBlockFooter({ children }: PatientsDataBlockFooterProps) {
  return <footer>{children}</footer>
}

export const PatientsDataBlock = Object.assign(PatientsDataBlockRoot, {
  Header: PatientsDataBlockHeader,
  Toolbar: PatientsDataBlockToolbar,
  Content: PatientsDataBlockContent,
  Footer: PatientsDataBlockFooter,
})
