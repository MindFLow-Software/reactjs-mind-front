import './practice-context-list-item.css'

import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Building2, Star } from 'lucide-react'

import { ContextType } from '@/types/psychologist/context-type'
import type { IPsychologistPracticeContext } from '@/types/psychologist/practice-context'
import { Currency } from '@/utils/currency'

import { ContextMonogram } from '../context-monogram/context-monogram'
import { ContextStatusPill } from '../context-status-pill/context-status-pill'

const CONTEXT_TYPE_LABELS: Record<ContextType, string> = {
  CLINIC: 'Clínica · equipe',
  INDIVIDUAL: 'Atendimento individual',
}

const BILLING_MODEL_LABELS: Record<ContextType, string> = {
  CLINIC: 'Convênio e particular',
  INDIVIDUAL: 'Gestão própria',
}

type IPracticeContextListItem = {
  context: IPsychologistPracticeContext
  isPrincipal: boolean
  onEnter: (id: string) => void
}

export function PracticeContextListItem({
  context,
  isPrincipal,
  onEnter,
}: IPracticeContextListItem) {
  const TypeIcon =
    context.contextType === ContextType.CLINIC ? Building2 : Briefcase
  const name = context.nickname ?? CONTEXT_TYPE_LABELS[context.contextType]

  return (
    <motion.button
      type="button"
      className="ca-row"
      onClick={() => onEnter(context.id)}
      aria-current={isPrincipal ? 'true' : undefined}
      aria-label={`Acessar ${name}`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="ca-row-inner ca-gutter">
        <ContextMonogram context={context} size="list" showPip />

        <div className="flex flex-col gap-1 min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="ca-row-name truncate">{name}</span>
            {isPrincipal && (
              <span title="Contexto principal" className="shrink-0 inline-flex">
                <Star size={14} className="text-amber-500 fill-amber-500" />
              </span>
            )}
            <ContextStatusPill isActive={context.isActive} />
          </div>
          <div className="ca-row-sub">
            <TypeIcon size={13} />
            <span>{CONTEXT_TYPE_LABELS[context.contextType]}</span>
            <span className="opacity-40">·</span>
            <span>{BILLING_MODEL_LABELS[context.contextType]}</span>
          </div>
        </div>

        <div className="ca-row-metrics">
          <div className="ca-row-metric ca-row-metric--fee">
            <span className="ca-row-metric-label">Valor / sessão</span>
            <span className="ca-row-metric-value">
              {Currency.toBRL(context.consultationFee) ?? '—'}
            </span>
          </div>
          <div className="ca-row-metric">
            <span className="ca-row-metric-label">Pacientes ativos</span>
            <span className="ca-row-metric-value">—</span>
          </div>
        </div>

        <ArrowRight size={20} className="ca-row-enter shrink-0" />
      </div>
    </motion.button>
  )
}
