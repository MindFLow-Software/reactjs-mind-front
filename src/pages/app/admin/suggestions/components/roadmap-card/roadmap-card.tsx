'use client'

import {
  ThumbsUp,
  Calendar,
  Clock,
  Search,
  Rocket,
  ChevronRight,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { translatedSuggestionCategory } from '@/constants/translated-suggestion-category'
import './roadmap-card.css'

interface RoadmapCardProps {
  item: ISuggestion
  onStatusChange: (id: string, status: string) => void
  isUpdating: boolean
}

const STEPS = [
  {
    id: 'OPEN',
    label: 'Votação',
    icon: Search,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'UNDER_REVIEW',
    label: 'Em Estudo',
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    id: 'PLANNED',
    label: 'Implementando',
    icon: Calendar,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    id: 'IMPLEMENTED',
    label: 'Concluído',
    icon: Rocket,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
]

export function RoadmapCard({
  item,
  onStatusChange,
  isUpdating,
}: RoadmapCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <article className="group ads-roadmap-article">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 min-w-0">
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="ads-roadmap-badge">
                  {translatedSuggestionCategory[item.category] || item.category}
                </span>
                <div className="ads-roadmap-likes">
                  <ThumbsUp className="size-3.5 fill-amber-500/20" />
                  <span className="text-[10px] font-black">
                    {item.likesCount || 0}
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="ads-roadmap-title break-words">{item.title}</h3>
                <p className="ads-roadmap-desc break-words">
                  &quot;{item.description}&quot;
                </p>
              </div>

              <div className="ads-roadmap-author-row">
                <div className="ads-roadmap-avatar size-6 text-[8px]">
                  {item.psychologistName?.substring(0, 2).toUpperCase()}
                </div>
                <span className="ads-roadmap-author-name">
                  {item.psychologistName} •{' '}
                  {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>

            {/* Stepper de Status */}
            <div
              className="ads-roadmap-stepper"
              onClick={(e) => e.stopPropagation()}
            >
              {STEPS.map((step, index) => {
                const isCurrent = item.status === step.id
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      disabled={isUpdating}
                      onClick={() => onStatusChange(item.id, step.id)}
                      className={cn(
                        'ads-roadmap-step-btn',
                        isCurrent
                          ? `${step.bg} ${step.color} shadow-sm border border-border`
                          : 'text-muted-foreground hover:bg-muted',
                      )}
                    >
                      <step.icon className="size-3" />
                      <span className={cn(!isCurrent && 'hidden xl:inline')}>
                        {step.label}
                      </span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <ChevronRight className="size-3 text-muted/50 mx-0.5" />
                    )}
                  </div>
                )
              })}

              <div className="ml-1 pl-1 border-l border-border">
                <button
                  onClick={() => onStatusChange(item.id, 'REJECTED')}
                  className="ads-roadmap-reject-btn"
                >
                  <XCircle className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      </DialogTrigger>

      <DialogContent className="ads-roadmap-dialog-content">
        <DialogHeader>
          <div className="mb-2">
            <span className="ads-roadmap-badge-lg">
              {translatedSuggestionCategory[item.category] || item.category}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground leading-tight break-words">
            {item.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="ads-roadmap-dialog-desc-box">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed break-words">
              {item.description}
            </p>
          </div>

          <footer className="ads-roadmap-dialog-footer">
            <div className="flex items-center gap-3 min-w-0">
              <div className="ads-roadmap-avatar size-10 text-xs">
                {item.psychologistName?.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="ads-roadmap-footer-label">
                  Sugestão enviada por
                </span>
                <span className="text-xs font-bold text-foreground truncate">
                  {item.psychologistName}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="ads-roadmap-footer-label block">
                Data do Registro
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {format(new Date(item.createdAt), "dd 'de' MMMM", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  )
}
