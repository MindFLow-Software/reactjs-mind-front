import './card-section.css'

export type ICardSectionHeader = {
  title: string
  subtitle: string
  action?: React.ReactNode
}

type ICardSection = {
  header: ICardSectionHeader
  children: React.ReactNode
}

export function CardSection({ header, children }: ICardSection) {
  const { title, subtitle, action } = header

  return (
    <div className="gd-card">
      <div className="gd-card__head">
        <div className="gd-card__title-wrap">
          <p className="gd-card__title">{title}</p>
          <p className="gd-card__subtitle">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="gd-card__body">{children}</div>
    </div>
  )
}
