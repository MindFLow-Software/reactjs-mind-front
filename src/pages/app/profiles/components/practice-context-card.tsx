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
import { TitleIcon } from '@/components/title-icon/title-icon'
import { ActiveBadge } from '@/components/active-badge/active-badge'

import { Currency } from '@/utils/currency'
import { ContextType } from '@/types/psychologist/context-type'
import type { IPsychologistPracticeContext } from '@/types/psychologist/practice-context'

import './practice-context-card.css'

const CONTEXT_TYPE_LABELS = {
  INDIVIDUAL: 'Atendimento individual',
  CLINIC: 'Clínica',
}

interface PracticeContextCardProps {
  context: IPsychologistPracticeContext
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
    <Card className="pf-entity-card">
      <CardHeader className="pf-entity-card-header">
        <TitleIcon variant="primary">
          {isClinic ? (
            <Building2 className="size-5" />
          ) : (
            <Briefcase className="size-5" />
          )}
        </TitleIcon>

        <div className="pf-entity-card-title-wrap">
          <CardTitle className="text-sm text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {typeLabel}
          </CardDescription>
        </div>

        <ActiveBadge isActive={context.isActive} />
      </CardHeader>

      <CardContent>
        <CardDescription className="mb-4">
          {isClinic
            ? 'Atuação vinculada à clínica com agenda compartilhada.'
            : 'Espaço de atendimento particular com gestão própria.'}
        </CardDescription>
        <div className="pf-stat-box">
          <p className="pf-stat-label">valor por sessão</p>
          <p className="mt-1 text-sm font-bold text-foreground">{fee ?? '—'}</p>
        </div>
      </CardContent>

      <CardFooter className="pf-entity-card-footer">
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
