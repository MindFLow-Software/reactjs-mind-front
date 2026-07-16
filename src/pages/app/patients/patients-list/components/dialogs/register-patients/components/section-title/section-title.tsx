import './section-title.css'
import type { ElementType, ReactNode } from 'react'

type ISectionTitle = {
  icon: ElementType
  label: string
  children?: ReactNode
}

export function SectionTitle({ icon: Icon, label, children }: ISectionTitle) {
  return (
    <div className="rp-section-title">
      <Icon className="rp-section-title__icon" />
      <span className="rp-section-title__label">{label}</span>
      {children}
    </div>
  )
}
