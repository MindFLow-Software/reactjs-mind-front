import './practice-type-card.css'

import type { ElementType } from 'react'
import { ArrowRight } from 'lucide-react'

import { TitleIcon } from '@/components/title-icon'
import { cn } from '@/lib/utils'

export interface IPracticeTypeCardOption {
  variant: 'individual' | 'clinic'
  icon: ElementType
  title: string
  description: string
  bullets: string[]
  onContinue: () => void
}

const VARIANT_ICON: Record<
  IPracticeTypeCardOption['variant'],
  'primary' | 'secondary'
> = {
  individual: 'secondary',
  clinic: 'primary',
}

interface IPracticeTypeCard {
  option: IPracticeTypeCardOption
}

export function PracticeTypeCard({ option }: IPracticeTypeCard) {
  const {
    variant,
    icon: Icon,
    title,
    description,
    bullets,
    onContinue,
  } = option

  return (
    <button
      type="button"
      onClick={onContinue}
      className={cn('pc-tcard', `pc-tcard--${variant}`)}
    >
      <div className="pc-tcard-body">
        <TitleIcon variant={VARIANT_ICON[variant]}>
          <Icon />
        </TitleIcon>
        <div>
          <h2 className="pc-tcard-title">{title}</h2>
          <p className="pc-tcard-desc">{description}</p>
        </div>
        <ul className="pc-tcard-list">
          {bullets.map((bullet) => (
            <li key={bullet} className="pc-tcard-list-item">
              <span className="pc-tcard-list-dash">–</span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>
      <div className="pc-tcard-foot">
        <span className="pc-tcard-foot-label">Continuar</span>
        <span className="pc-tcard-go">
          <ArrowRight size={16} />
        </span>
      </div>
    </button>
  )
}
