import { memo, useCallback } from 'react'
import { Briefcase, Building2, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

  const fee = formatConsultationFee(context.consultationFee)
  const isClinic = context.contextType === 'CLINIC'
  const typeLabel = CONTEXT_TYPE_LABELS[context.contextType] ?? 'Atendimento'
  const title = context.nickname?.trim() || typeLabel

  return (
    <Card className="flex flex-col gap-0 overflow-hidden p-0">
      <div className="flex items-start gap-3 p-5 pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
          {isClinic ? (
            <Building2 className="size-5" />
          ) : (
            <Briefcase className="size-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{typeLabel}</p>
        </div>

        <div
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            context.isActive
              ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
              : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
          )}
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              context.isActive ? 'bg-green-500' : 'bg-red-400',
            )}
          />
          {context.isActive ? 'Ativo' : 'Inativo'}
        </div>
      </div>

      <div className="mx-5 mb-4 rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-muted-foreground">
          VALOR POR SESSÃO
        </p>
        <p className="mt-1 text-xl font-bold text-foreground">
          {fee ?? '—'}
        </p>
      </div>

      <div className="mt-auto border-t border-border px-5 py-3">
        <Button
          variant="outline"
          className="w-full justify-center gap-2 font-medium"
          onClick={handleClick}
        >
          Acessar contexto
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </Card>
  )
}

export const PracticeContextCard = memo(PracticeContextCardBase)
