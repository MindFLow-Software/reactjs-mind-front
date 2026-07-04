'use client'

import {
  MessageCircle,
  ChevronUp,
  Check,
  Zap,
  Clock,
  Users,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { ISuggestion } from '@/types/suggestion'
import {
  SUGGESTION_TIMELINE_STEPS,
  SUGGESTION_TIMELINE_PROGRESS,
} from '@/components/suggestion-detail-config'
import './suggestion-detail-sidebar.css'

const MOCK_RELATED = [
  { votes: 312, title: 'Transcrição automática de sessões' },
  { votes: 204, title: 'App mobile para pacientes' },
  { votes: 87, title: 'Relatórios de evolução automáticos' },
]

interface SuggestionDetailSidebarProps {
  item: ISuggestion
}

export function SuggestionDetailSidebar({
  item,
}: SuggestionDetailSidebarProps) {
  const timelineCfg = SUGGESTION_TIMELINE_PROGRESS[item.status]

  const formattedDate = format(
    new Date(item.createdAt),
    "dd 'de' MMM. 'de' yyyy",
    { locale: ptBR },
  )
  const relativeShort = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })
    .replace('há ', '')
    .replace('em ', '')

  const miniStats = [
    { label: 'Votos', value: String(item.likesCount), Icon: ChevronUp },
    { label: 'Comentários', value: '0', Icon: MessageCircle },
    { label: 'Aberta há', value: relativeShort, Icon: Clock },
    { label: 'Seguidores', value: '0', Icon: Users },
  ]

  return (
    <div className="sdm-sidebar">
      <div className="sdm-card flex flex-col gap-3">
        <span className="sdm-card-label">Quem votou</span>
        {item.likesCount > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              {Array.from({ length: Math.min(5, item.likesCount) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className={cn('sdm-voter-avatar', i > 0 && '-ml-2')}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ),
              )}
              {item.likesCount > 5 && (
                <div className="-ml-2 size-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] font-semibold text-muted-foreground">
                  +{item.likesCount - 5}
                </div>
              )}
            </div>
            <p className="text-[12.5px] text-muted-foreground">
              <strong className="text-foreground font-bold">
                {item.likesCount}
              </strong>{' '}
              psicólogos votaram
            </p>
          </div>
        ) : (
          <p className="text-[12px] text-muted-foreground italic">
            Nenhum voto ainda.
          </p>
        )}
      </div>

      <div className="sdm-card">
        <span className="sdm-card-label mb-4 block">Jornada</span>
        <div className="relative">
          <div className="absolute left-[12px] top-3 bottom-3 w-px bg-border" />
          <div className="">
            {SUGGESTION_TIMELINE_STEPS.map((label, i) => {
              const isDone = i <= timelineCfg.doneUntil
              const isCurrent = i === timelineCfg.currentIdx
              return (
                <div
                  key={label}
                  className="relative flex items-center gap-3 py-2 pl-8"
                >
                  <div
                    className={cn(
                      'sdm-timeline-node',
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : isCurrent
                          ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                          : 'bg-card border-border',
                    )}
                  >
                    {isDone ? (
                      <Check className="size-3" strokeWidth={3} />
                    ) : isCurrent ? (
                      <Zap className="size-3" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-border" />
                    )}
                  </div>
                  <div className={cn(!isDone && !isCurrent && 'opacity-40')}>
                    <p
                      className={cn(
                        'text-[12.5px] font-semibold leading-tight',
                        isDone || isCurrent
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {label}
                    </p>
                    {isDone && (
                      <p className="text-[11px] tabular-nums text-muted-foreground mt-0.5">
                        {formattedDate}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="sdm-card !p-0 overflow-hidden">
        <div className="grid grid-cols-2">
          {miniStats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                'p-3',
                i % 2 === 0 && 'border-r border-border',
                i < 2 && 'border-b border-border',
              )}
            >
              <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
                <stat.Icon className="size-3" />
                <span className="text-[10px] font-medium">{stat.label}</span>
              </div>
              <p className="text-[15px] font-bold text-foreground tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="sdm-card flex flex-col gap-3">
        <span className="sdm-card-label">Relacionadas</span>
        <div className="flex flex-col gap-1">
          {MOCK_RELATED.map((rel) => (
            <button key={rel.title} type="button" className="sdm-related">
              <span className="text-[13px] font-bold text-muted-foreground tabular-nums w-8 shrink-0 mt-px">
                {rel.votes}
              </span>
              <span className="text-[12.5px] text-foreground leading-[1.4] line-clamp-2">
                {rel.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
