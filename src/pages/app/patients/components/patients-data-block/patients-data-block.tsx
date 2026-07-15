import './patients-data-block.css'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type IPatientsDataBlockRoot = {
  children: ReactNode
  className?: string
}

type IPatientsDataBlockHeader = {
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
}

type IPatientsDataBlockToolbar = {
  children: ReactNode
}

type IPatientsDataBlockContent = {
  children: ReactNode
  className?: string
}

type IPatientsDataBlockFooter = {
  children: ReactNode
}

function PatientsDataBlockRoot({
  children,
  className,
}: IPatientsDataBlockRoot) {
  return <section className={cn('pdb-root', className)}>{children}</section>
}

function PatientsDataBlockHeader({
  title,
  description,
  children,
}: IPatientsDataBlockHeader) {
  if (!title && !description && !children) return null

  return (
    <header className="pdb-header">
      <div className="pdb-heading">
        {title && <h2 className="pdb-title">{title}</h2>}
        {description && <p className="pdb-description">{description}</p>}
      </div>
      {children && <div className="pdb-actions">{children}</div>}
    </header>
  )
}

function PatientsDataBlockToolbar({ children }: IPatientsDataBlockToolbar) {
  return <div>{children}</div>
}

function PatientsDataBlockContent({
  children,
  className,
}: IPatientsDataBlockContent) {
  return <div className={cn('pdb-content', className)}>{children}</div>
}

function PatientsDataBlockFooter({ children }: IPatientsDataBlockFooter) {
  return <footer>{children}</footer>
}

export const PatientsDataBlock = Object.assign(PatientsDataBlockRoot, {
  Header: PatientsDataBlockHeader,
  Toolbar: PatientsDataBlockToolbar,
  Content: PatientsDataBlockContent,
  Footer: PatientsDataBlockFooter,
})
