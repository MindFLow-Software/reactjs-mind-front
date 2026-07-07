import './practice-context-all-view.css'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, Plus, ShieldCheck } from 'lucide-react'

import type { IPsychologistPracticeContext } from '@/types/psychologist'

import { PracticeContextListItem } from './practice-context-list-item'

interface PracticeContextAllViewProps {
  contexts: IPsychologistPracticeContext[]
  activeContextId: string | null
  onEnter: (id: string) => void
  onViewMain: () => void
  onAdd: () => void
}

interface TopbarProps {
  contexts: IPsychologistPracticeContext[]
  onViewMain: () => void
}

function Topbar({ contexts, onViewMain }: TopbarProps) {
  const total = contexts.length
  const active = contexts.filter((c) => c.isActive).length

  return (
    <div className="ca-topbar">
      <div className="ca-topbar-inner ca-gutter">
        <button
          type="button"
          className="ca-back"
          onClick={onViewMain}
          aria-label="Voltar para perfis"
        >
          <ChevronLeft size={17} className="ca-back-icon" />
          Voltar para perfis
        </button>
        <span className="ca-topbar-count">
          {total} {total === 1 ? 'contexto' : 'contextos'} · {active}{' '}
          {active === 1 ? 'ativo' : 'ativos'}
        </span>
      </div>
    </div>
  )
}

function AllContextsHeader() {
  return (
    <div className="ca-head ca-gutter">
      <span className="ca-eyebrow">CONTEXTOS</span>
      <h2 className="ca-title">Todos os seus contextos</h2>
      <p className="ca-subtitle">
        Compare e acesse qualquer ambiente de atuação.
      </p>
    </div>
  )
}

function AddRow({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.button
      type="button"
      className="ca-row ca-row--add"
      onClick={onAdd}
      aria-label="Adicionar novo contexto"
      whileTap={{ scale: 0.98 }}
    >
      <div className="ca-row-inner ca-gutter">
        <span className="ca-add-icon">
          <Plus size={19} />
        </span>
        <div className="flex flex-col gap-0.5 text-left">
          <span className="ca-add-title">Adicionar novo contexto</span>
          <span className="ca-add-sub">
            Consultório particular, clínica ou convênio
          </span>
        </div>
        <ArrowRight size={20} className="ca-row-enter ml-auto shrink-0" />
      </div>
    </motion.button>
  )
}

function LgpdFooter() {
  return (
    <div className="ca-foot ca-gutter">
      <ShieldCheck
        size={14}
        className="text-green-600 dark:text-green-400 shrink-0"
      />
      <span>Dados de cada contexto ficam isolados conforme a LGPD.</span>
    </div>
  )
}

export function PracticeContextAllView({
  contexts,
  activeContextId,
  onEnter,
  onViewMain,
  onAdd,
}: PracticeContextAllViewProps) {
  return (
    <div className="ca-shell">
      <Topbar contexts={contexts} onViewMain={onViewMain} />
      <AllContextsHeader />
      <div className="ca-list">
        {contexts.map((context) => (
          <PracticeContextListItem
            key={context.id}
            context={context}
            isPrincipal={context.id === activeContextId}
            onEnter={onEnter}
          />
        ))}
        <AddRow onAdd={onAdd} />
      </div>
      <LgpdFooter />
    </div>
  )
}
