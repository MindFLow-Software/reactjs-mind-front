'use client'

import { ChevronUp, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ISuggestion } from '@/types/suggestion'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { SuggestionDetailModalContent } from '@/components/suggestion-detail-modal'

type CategoryKey = ISuggestion['category']

const CATEGORY_CONFIG: Record<
  CategoryKey,
  {
    label: string
    dot: string
    pillBg: string
    pillText: string
  }
> = {
  UI_UX: {
    label: 'Fluxo',
    dot: 'bg-violet-500',
    pillBg: 'bg-violet-50 dark:bg-violet-950/30',
    pillText: 'text-violet-700 dark:text-violet-400',
  },
  REPORTS: {
    label: 'Relatórios',
    dot: 'bg-amber-500',
    pillBg: 'bg-amber-50 dark:bg-amber-950/30',
    pillText: 'text-amber-700 dark:text-amber-400',
  },
  INTEGRATIONS: {
    label: 'Integrações',
    dot: 'bg-blue-500',
    pillBg: 'bg-blue-50 dark:bg-blue-950/30',
    pillText: 'text-blue-700 dark:text-blue-400',
  },
  SCHEDULING: {
    label: 'Paciente',
    dot: 'bg-pink-500',
    pillBg: 'bg-pink-50 dark:bg-pink-950/30',
    pillText: 'text-pink-700 dark:text-pink-400',
  },
  PRIVACY_LGPD: {
    label: 'Financeiro',
    dot: 'bg-emerald-500',
    pillBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    pillText: 'text-emerald-700 dark:text-emerald-400',
  },
  OTHERS: {
    label: 'Outros',
    dot: 'bg-slate-400',
    pillBg: 'bg-slate-100 dark:bg-slate-800/50',
    pillText: 'text-slate-600 dark:text-slate-400',
  },
}

interface SuggestionCardProps {
  item: ISuggestion
  userId?: string
  onLike: (id: string) => void
}

export function SuggestionCard({ item, userId, onLike }: SuggestionCardProps) {
  const isLiked = userId ? item.likes?.includes(userId) : false
  const isImplemented = item.status === 'IMPLEMENTED'
  const cat = CATEGORY_CONFIG[item.category]

  const initials = (item.psychologistName ?? '')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <article
          className={cn(
            'flex gap-3.5 rounded-xl p-[14px] cursor-pointer transition-all duration-200 group border min-w-0 w-full min-h-[110px]',
            isImplemented
              ? 'bg-card border-border hover:-translate-y-px hover:border-emerald-300 hover:shadow-sm'
              : isLiked
                ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 hover:-translate-y-px hover:shadow-md'
                : 'bg-card border-border hover:-translate-y-px hover:border-blue-400 hover:shadow-md',
          )}
        >
          {isImplemented ? (
            <div className="flex flex-col items-center justify-center gap-1.5 shrink-0 w-10 h-[58px] self-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/30">
              <div className="size-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="size-3.5 text-white" strokeWidth={3} />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onLike(item.id)
              }}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 shrink-0 w-10 h-[58px] self-center rounded-2xl transition-all cursor-pointer active:scale-95',
                isLiked
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border',
              )}
            >
              <ChevronUp className="size-3.5" strokeWidth={2.5} />
              <span className="text-lg font-extrabold tabular-nums leading-none">
                {item.likesCount}
              </span>
            </button>
          )}

          <div className="flex-1 min-w-0 space-y-1.5">
            <h3
              className={cn(
                'font-bold leading-snug line-clamp-2 break-words transition-colors text-[14.5px]',
                isImplemented
                  ? 'text-foreground/60'
                  : 'text-foreground group-hover:text-primary',
              )}
            >
              {item.title}
            </h3>

            {!isImplemented && (
              <p className="text-[12px] text-muted-foreground line-clamp-1 leading-relaxed break-words">
                {item.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                  cat.pillBg,
                  cat.pillText,
                )}
              >
                <span
                  className={cn('size-1.5 rounded-full shrink-0', cat.dot)}
                />
                {cat.label}
              </span>

              <div className="ml-auto shrink-0">
                <div className="size-5 rounded-full bg-muted border border-border flex items-center justify-center text-[9px] font-bold text-foreground/60">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </article>
      </DialogTrigger>

      <SuggestionDetailModalContent
        item={item}
        userId={userId}
        onLike={onLike}
      />
    </Dialog>
  )
}
