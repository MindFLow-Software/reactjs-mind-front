'use client'

import { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Bell, Share2, X, MessageCircle, ChevronUp, Check } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import { DialogTitle } from '@/components/ui/dialog'
import { SUGGESTION_CATEGORY_DISPLAY } from '@/constants/suggestion-category-display'
import { Normalizer } from '@/utils/normalizer'
import { Clipboard } from '@/utils/clipboard'
import './suggestion-detail-header.css'

interface SuggestionDetailHeaderProps {
  item: ISuggestion
  userId?: string
  onLike: (id: string) => void
}

export function SuggestionDetailHeader({
  item,
  userId,
  onLike,
}: SuggestionDetailHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const isLiked = userId ? item.likes?.includes(userId) : false
  const isImplemented = item.status === 'IMPLEMENTED'
  const cat = SUGGESTION_CATEGORY_DISPLAY[item.category]
  const initials = Normalizer.initials(item.psychologistName)

  const formattedDate = format(
    new Date(item.createdAt),
    "dd 'de' MMM. 'de' yyyy",
    { locale: ptBR },
  )
  const relativeDate = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  const handleToggleFollow = () => setIsFollowing((v) => !v)
  const handleCopyLink = () => Clipboard.copy(window.location.href)

  return (
    <div className="sdm-header">
      {isImplemented ? (
        <div className="sdm-vote-done">
          <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
            <Check
              className="size-5 text-emerald-600 dark:text-emerald-400"
              strokeWidth={2.5}
            />
          </div>
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide text-center">
            Disponível
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onLike(item.id)}
          aria-pressed={isLiked}
          title={isLiked ? 'Remover voto' : 'Votar nessa sugestão'}
          className={cn(
            'sdm-vote',
            isLiked
              ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
              : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-border dark:bg-muted/50 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 dark:hover:border-blue-500',
          )}
        >
          <ChevronUp className="size-[18px]" strokeWidth={2.5} />
          <span className="text-[20px] font-bold tabular-nums leading-none">
            {item.likesCount}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.06em]">
            VOTOS
          </span>
        </button>
      )}

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <DialogTitle id="dm-title" className="sdm-title">
          {item.title}
        </DialogTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('sdm-pill', cat.pillBg, cat.pillText)}>
            <span className={cn('size-1.5 rounded-full shrink-0', cat.dot)} />
            {cat.label}
          </span>
          <span className="size-[3px] rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
          <div className="flex items-center gap-1.5">
            <div className="sdm-author-avatar">{initials}</div>
            <span className="text-[11.5px] text-muted-foreground">
              por{' '}
              <strong className="font-semibold text-foreground">
                {item.psychologistName}
              </strong>
            </span>
          </div>
          <span className="size-[3px] rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
          <span
            className="text-[11.5px] text-muted-foreground"
            title={formattedDate}
          >
            {relativeDate}
          </span>
          <span className="size-[3px] rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
          <span className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
            <MessageCircle className="size-3" />
            <span>0</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 pt-0.5">
        <button
          type="button"
          title={isFollowing ? 'Parar de seguir' : 'Seguir atualizações'}
          aria-label={isFollowing ? 'Parar de seguir' : 'Seguir atualizações'}
          onClick={handleToggleFollow}
          className={cn(
            'sdm-action',
            isFollowing
              ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
              : 'border-border bg-card hover:bg-muted/50 text-muted-foreground',
          )}
        >
          <Bell className="size-4" />
        </button>
        <button
          type="button"
          title="Compartilhar"
          aria-label="Compartilhar"
          onClick={handleCopyLink}
          className="sdm-action border-border bg-card hover:bg-muted/50 text-muted-foreground"
        >
          <Share2 className="size-4" />
        </button>
        <DialogPrimitive.Close asChild>
          <button
            type="button"
            title="Fechar"
            aria-label="Fechar"
            className="size-[34px] rounded-lg hover:bg-muted/50 text-muted-foreground flex items-center justify-center transition-colors"
          >
            <X className="size-4" />
          </button>
        </DialogPrimitive.Close>
      </div>
    </div>
  )
}
