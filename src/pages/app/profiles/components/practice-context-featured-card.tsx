import './practice-context-featured-card.css'

import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Building2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  ContextType,
  type IPsychologistPracticeContext,
} from '@/types/psychologist'
import { Currency } from '@/utils/currency'

import { ContextMonogram } from './context-monogram'
import { ContextStatusPill } from './context-status-pill'

const MotionButton = motion.create(Button)

const CONTEXT_TYPE_LABELS: Record<ContextType, string> = {
  CLINIC: 'Clínica · equipe',
  INDIVIDUAL: 'Atendimento individual',
}

const BILLING_MODEL_LABELS: Record<ContextType, string> = {
  CLINIC: 'Convênio e particular',
  INDIVIDUAL: 'Gestão própria',
}

interface PracticeContextFeaturedCardProps {
  context: IPsychologistPracticeContext
  otherContextsCount: number
  onEnter: (id: string) => void
  onViewAll: () => void
}

function FeatStats({ context }: { context: IPsychologistPracticeContext }) {
  return (
    <div className="ca-feat-stats">
      <div className="ca-feat-stat">
        <span className="ca-feat-stat-label">VALOR / SESSÃO</span>
        <span className="ca-feat-stat-value">
          {Currency.toBRL(context.consultationFee) ?? '—'}
        </span>
      </div>
      <div className="ca-feat-stat">
        <span className="ca-feat-stat-label">PACIENTES ATIVOS</span>
        <span className="ca-feat-stat-value">—</span>
      </div>
      <div className="ca-feat-stat">
        <span className="ca-feat-stat-label">SESSÕES NA SEMANA</span>
        <span className="ca-feat-stat-value">—</span>
      </div>
    </div>
  )
}

export function PracticeContextFeaturedCard({
  context,
  otherContextsCount,
  onEnter,
  onViewAll,
}: PracticeContextFeaturedCardProps) {
  const TypeIcon =
    context.contextType === ContextType.CLINIC ? Building2 : Briefcase

  return (
    <Card className="relative overflow-hidden w-full p-0 gap-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/30 flex flex-col">
      <CardHeader className="flex items-center pt-4">
        <ContextMonogram context={context} size="featured" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {CONTEXT_TYPE_LABELS[context.contextType]}
        </span>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ContextStatusPill isActive={context.isActive} />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {context.nickname ?? CONTEXT_TYPE_LABELS[context.contextType]}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <TypeIcon size={13} />
            <span>{BILLING_MODEL_LABELS[context.contextType]}</span>
          </div>
        </div>

        <FeatStats context={context} />
      </CardContent>

      <CardFooter className="pb-4">
        <div className="flex gap-2 w-full">
          <MotionButton
            className="flex-1 gap-2"
            whileTap={{ scale: 0.98 }}
            onClick={() => onEnter(context.id)}
          >
            Acessar contexto
            <ArrowRight size={16} />
          </MotionButton>
          {otherContextsCount > 0 && (
            <Button variant="outline" onClick={onViewAll}>
              Ver outros {otherContextsCount}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
