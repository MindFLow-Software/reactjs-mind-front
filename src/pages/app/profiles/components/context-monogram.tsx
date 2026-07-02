import './context-monogram.css'

import { cn } from '@/lib/utils'
import type { PsychologistPracticeContext } from '@/types/psychologist'

const CONTEXT_TYPE_LABELS: Record<string, string> = {
  CLINIC: 'Clinica Equipe',
  INDIVIDUAL: 'At Ind',
}

function getInitials(context: PsychologistPracticeContext): string {
  const name = context.nickname ?? CONTEXT_TYPE_LABELS[context.contextType]
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

interface ContextMonogramProps {
  context: PsychologistPracticeContext
  size: 'featured' | 'list'
  showPip?: boolean
}

export function ContextMonogram({
  context,
  size,
  showPip,
}: ContextMonogramProps) {
  const initials = getInitials(context)

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
            'bg-green-600': context.isActive,
            'bg-amber-500': !context.isActive,
          })}
        />
      )}
    </div>
  )
}
