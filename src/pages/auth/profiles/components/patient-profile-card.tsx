import { memo, useCallback, type KeyboardEvent } from 'react'
import { ChevronRight, CircleUserRound } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { PatientProfileMe } from '../constants'

interface PatientProfileCardProps {
  profile: PatientProfileMe
  onSelect: () => void
}

function PatientProfileCardBase({
  profile,
  onSelect,
}: PatientProfileCardProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect()
      }
    },
    [onSelect],
  )

  const subtitle = profile.psychologistPracticeContextId
    ? 'Vinculado a um psicólogo'
    : 'Perfil independente'

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer gap-3 py-5 transition-all',
        'hover:-translate-y-0.5 hover:shadow-lg',
        'focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-blue-600/[.18]',
      )}
    >
      <div className="flex items-center gap-3 px-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
          <CircleUserRound className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">
            Perfil de paciente
          </p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </div>
    </Card>
  )
}

export const PatientProfileCard = memo(PatientProfileCardBase)
