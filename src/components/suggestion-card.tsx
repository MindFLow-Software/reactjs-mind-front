'use client'

import { ChevronUp, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ISuggestion } from '@/types/suggestion'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { SuggestionDetailModalContent } from '@/components/suggestion-detail-modal'
import { SUGGESTION_CATEGORY_DISPLAY } from '@/constants/suggestion-category-display'
import { getInitials } from '@/utils/get-initials'
import './suggestion-card.css'

interface SuggestionCardProps {
  item: ISuggestion
  userId?: string
  onLike: (id: string) => void
}

export function SuggestionCard({ item, userId, onLike }: SuggestionCardProps) {
  const isLiked = userId ? item.likes?.includes(userId) : false
  const isImplemented = item.status === 'IMPLEMENTED'
  const cat = SUGGESTION_CATEGORY_DISPLAY[item.category]
  const initials = getInitials(item.psychologistName)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <article
          className={cn(
            'sc-card group',
            isImplemented
              ? 'sc-card--implemented'
              : isLiked
                ? 'sc-card--liked'
                : 'sc-card--default',
          )}
        >
          {isImplemented ? (
            <div className="sc-badge sc-badge--implemented">
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
                'sc-badge sc-vote',
                isLiked ? 'sc-vote--liked' : 'sc-vote--default',
              )}
            >
              <ChevronUp className="size-3.5" strokeWidth={2.5} />
              <span className="text-lg font-extrabold tabular-nums leading-none">
                {item.likesCount}
              </span>
            </button>
          )}

          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <h3
              className={cn(
                'sc-title',
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
              <span className={cn('sc-pill', cat.pillBg, cat.pillText)}>
                <span className={cn('sc-dot', cat.dot)} />
                {cat.label}
              </span>

              <div className="ml-auto shrink-0">
                <div className="sc-avatar">{initials}</div>
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
