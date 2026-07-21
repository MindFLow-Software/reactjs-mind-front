import './practice-type-card.css'

import type { ElementType } from 'react'
import { ArrowRight } from 'lucide-react'

import { TitleIcon } from '@/components/title-icon/title-icon'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export type IPracticeTypeCardOption = {
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

type IPracticeTypeCard = {
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
    >
      <Card className={cn('pc-tcard', `pc-tcard--${variant}`)}>
        <CardHeader className="pc-tcard-header">
          <TitleIcon variant={VARIANT_ICON[variant]}>
            <Icon />
          </TitleIcon>
          <div>
            <h2 className="pc-tcard-title">{title}</h2>
            <p className="pc-tcard-desc">{description}</p>
          </div>
        </CardHeader>
        <CardContent className="pc-tcard-body">
          <ul className="pc-tcard-list">
            {bullets.map((bullet) => (
              <li key={bullet} className="pc-tcard-list-item">
                <span className="pc-tcard-list-dash">–</span>
                {bullet}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pc-tcard-footer">
          <span className="pc-tcard-footer-label">Continuar</span>
          <span className="pc-tcard-go">
            <ArrowRight size={16} />
          </span>
        </CardFooter>
      </Card>
    </button>
  )
}
