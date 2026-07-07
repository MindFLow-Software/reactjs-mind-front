import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PatientsSurfaceProps {
  children: ReactNode
  className?: string
}

export function PatientsSurface({ children, className }: PatientsSurfaceProps) {
  return (
    <main
      className={cn(
        'rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-sm p-4 md:p-6',
        className,
      )}
    >
      {children}
    </main>
  )
}

interface PatientsPageShellRootProps {
  children: ReactNode
  className?: string
}

interface PatientsPageShellHeaderProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  children?: ReactNode
}

interface PatientsPageShellFiltersProps {
  children: ReactNode
}

interface PatientsPageShellContentProps {
  children: ReactNode
  className?: string
}

function PatientsPageShellRoot({
  children,
  className,
}: PatientsPageShellRootProps) {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>
}

function PatientsPageShellHeader({
  title,
  description,
  icon,
  children,
}: PatientsPageShellHeaderProps) {
  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-primary pl-5 py-2">
      <div className="flex flex-col gap-1">
        {title && (
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            {icon}
            <span>{title}</span>
          </h1>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </header>
  )
}

function PatientsPageShellFilters({ children }: PatientsPageShellFiltersProps) {
  return <PatientsSurface>{children}</PatientsSurface>
}

function PatientsPageShellContent({
  children,
  className,
}: PatientsPageShellContentProps) {
  return (
    <PatientsSurface className={cn('overflow-hidden', className)}>
      {children}
    </PatientsSurface>
  )
}

export const PatientsPageShell = Object.assign(PatientsPageShellRoot, {
  Header: PatientsPageShellHeader,
  Filters: PatientsPageShellFilters,
  Content: PatientsPageShellContent,
})
