import './context-monogram.css'

import { cn } from '@/lib/utils'
import { Normalizer } from '@/utils/normalizer'
import type { IPsychologistPracticeContext } from '@/types/psychologist/practice-context'

const CONTEXT_TYPE_LABELS: Record<string, string> = {
  CLINIC: 'Clinica Equipe',
  INDIVIDUAL: 'At Ind',
}

type IContextMonogram = {
  context: IPsychologistPracticeContext
  size: 'featured' | 'list'
  showPip?: boolean
}

export function ContextMonogram({ context, size, showPip }: IContextMonogram) {
  const name = context.nickname ?? CONTEXT_TYPE_LABELS[context.contextType]
  const initials = Normalizer.initials(name)

  return (
    <div
      className={cn('ca-mono ca-mono--blue relative shrink-0', {
        'ca-mono--featured': size === 'featured',
        'ca-mono--list': size === 'list',
      })}
    >
      <span className="ca-mono-text">{initials}</span>
      {showPip && (
        <span
          className={cn('ca-mono-pip', {
            'bg-success': context.isActive,
            'bg-warning': !context.isActive,
          })}
        />
      )}
    </div>
  )
}
