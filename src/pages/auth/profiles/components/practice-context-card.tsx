import { memo, useCallback, type KeyboardEvent } from 'react'
import { Building2, ChevronRight, Stethoscope } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CONTEXT_TYPE_LABELS, type PracticeContextMe } from '../constants'
import { formatConsultationFee } from '../helpers'

interface PracticeContextCardProps {
  context: PracticeContextMe
  onSelect: (id: string) => void
}

function PracticeContextCardBase({
  context,
  onSelect,
}: PracticeContextCardProps) {
  const handleClick = useCallback(
    () => onSelect(context.id),
    [context.id, onSelect],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect(context.id)
      }
    },
    [context.id, onSelect],
  )

  const fee = formatConsultationFee(context.consultationFee)
  const isClinic = context.contextType === 'CLINIC'
  const typeLabel = CONTEXT_TYPE_LABELS[context.contextType] ?? 'Atendimento'
  const title = context.nickname?.trim() || typeLabel

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer gap-3 py-5 transition-all',
        'hover:-translate-y-0.5 hover:shadow-lg',
        'focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-blue-600/[.18]',
      )}
    >
      <div className="flex items-center gap-3 px-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
          {isClinic ? (
            <Building2 className="size-5" />
          ) : (
            <Stethoscope className="size-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{typeLabel}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </div>

      {fee && (
        <div className="px-5">
          <span className="text-sm font-medium text-foreground/80">{fee}</span>
          <span className="text-xs text-muted-foreground"> / sessão</span>
        </div>
      )}
    </Card>
  )
}

export const PracticeContextCard = memo(PracticeContextCardBase)
