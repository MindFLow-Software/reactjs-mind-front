import { cn } from '@/lib/utils'

import './card-section.css'

export type ICardSectionHeader = {
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle: string
  action?: React.ReactNode
}

interface CardSectionProps {
  header: ICardSectionHeader
  children: React.ReactNode
}

export function CardSection({ header, children }: CardSectionProps) {
  const { icon, iconBg, title, subtitle, action } = header

  return (
    <div className="ph-card-section">
      <div className="ph-card-section__head">
        <div className={cn('ph-card-section__icon', iconBg)}>{icon}</div>
        <div className="ph-card-section__title-wrap">
          <p className="ph-card-section__title">{title}</p>
          <p className="ph-card-section__subtitle">{subtitle}</p>
        </div>
        {action}
      </div>
      <div>{children}</div>
    </div>
  )
}
