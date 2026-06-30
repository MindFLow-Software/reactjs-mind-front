import { useCallback } from 'react'
import { Briefcase, Building2, ArrowRight } from 'lucide-react'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { TitleIcon } from '@/components/title-icon'
import { ActiveBadge } from '@/components/active-badge'

import { Currency } from '@/utils/currency'
import { ContextType, type PsychologistPracticeContext } from '@/types/psychologist'

const CONTEXT_TYPE_LABELS = {
  INDIVIDUAL: 'Atendimento individual',
  CLINIC: 'Clínica',
}

interface PracticeContextCardProps {
  context: PsychologistPracticeContext
  onSelect: (id: string) => void
}

export function PracticeContextCard({
  context,
  onSelect,
}: PracticeContextCardProps) {
  const handleClick = useCallback(
    () => onSelect(context.id),
    [context.id, onSelect],
  )

  const fee = Currency.toBRL(context.consultationFee)
  const isClinic = context.contextType === ContextType.CLINIC
  const typeLabel = CONTEXT_TYPE_LABELS[context.contextType]
  const title = context.nickname || typeLabel

  return (
    <Card className="flex flex-col gap-0 overflow-hidden p-0 max-w-1/2 w-full">
      <CardHeader className="flex items-start gap-3 py-4">
        <TitleIcon variant="primary">
          {isClinic ? (
            <Building2 className="size-5" />
          ) : (
            <Briefcase className="size-5" />
          )}
        </TitleIcon>

        <div className="min-w-0 flex-1">
          <CardTitle className="text-sm text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{typeLabel}</CardDescription>
        </div>

        <ActiveBadge isActive={context.isActive} />
      </CardHeader>

      <CardContent>
        <CardDescription className="mb-4">
          {isClinic
            ? 'Atuação vinculada à clínica com agenda compartilhada.'
            : 'Espaço de atendimento particular com gestão própria.'
          }
        </CardDescription>
        <div className="grid grid-cols-2 rounded-md bg-muted/50 p-4">
          <div>
            <p className="text-xs tracking-wider text-muted-foreground uppercase">
              valor por sessão
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">
              {fee ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-muted-foreground uppercase">
              valor por sessão
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">
              {fee ?? '—'}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="py-4">
        <Button
          variant="outline"
          className="w-full justify-center gap-2 font-medium"
          onClick={handleClick}
        >
          Acessar contexto
          <ArrowRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
