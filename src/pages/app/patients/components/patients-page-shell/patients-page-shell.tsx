import './patients-page-shell.css'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type IPatientsSurface = {
  children: ReactNode
  className?: string
}

function PatientsSurface({ children, className }: IPatientsSurface) {
  return <main className={cn('pps-surface', className)}>{children}</main>
}

type IPatientsPageShellRoot = {
  children: ReactNode
  className?: string
}

type IPatientsPageShellHeader = {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  children?: ReactNode
}

type IPatientsPageShellContent = {
  children: ReactNode
  className?: string
}

function PatientsPageShellRoot({
  children,
  className,
}: IPatientsPageShellRoot) {
  return <div className={cn('pps-root', className)}>{children}</div>
}

function PatientsPageShellHeader({
  title,
  description,
  icon,
  children,
}: IPatientsPageShellHeader) {
  return (
    <header className="pps-header">
      <div className="pps-heading">
        {title && (
          <h1 className="pps-title">
            {icon}
            <span>{title}</span>
          </h1>
        )}
        {description && <p className="pps-description">{description}</p>}
      </div>
      {children && <div className="pps-actions">{children}</div>}
    </header>
  )
}

function PatientsPageShellContent({
  children,
  className,
}: IPatientsPageShellContent) {
  return (
    <PatientsSurface className={cn('overflow-hidden', className)}>
      {children}
    </PatientsSurface>
  )
}

export const PatientsPageShell = Object.assign(PatientsPageShellRoot, {
  Header: PatientsPageShellHeader,
  Content: PatientsPageShellContent,
})
