import { MessageCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Time } from '@/utils/time'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import { SUGGESTION_CATEGORY_DISPLAY } from '@/constants/suggestion-category-display'
import { MetaDot } from '@/components/suggestion-detail/meta-dot/meta-dot'
import { SuggestionInitialsAvatar } from '@/components/suggestion-detail/suggestion-initials-avatar/suggestion-initials-avatar'

import './header-meta.css'

type IHeaderMeta = {
  item: ISuggestion
}

export function HeaderMeta({ item }: IHeaderMeta) {
  const category = SUGGESTION_CATEGORY_DISPLAY[item.category]

  return (
    <div className="sdm-meta">
      <span className={cn('sdm-pill', category.pillBg, category.pillText)}>
        <span className={cn('sdm-pill-dot', category.dot)} />
        {category.label}
      </span>

      <MetaDot />

      <div className="sdm-meta-author">
        <SuggestionInitialsAvatar name={item.psychologistName} size="sm" />
        <span className="sdm-meta-text">
          por{' '}
          <strong className="sdm-meta-strong">{item.psychologistName}</strong>
        </span>
      </div>

      <MetaDot />

      <span
        className="sdm-meta-text"
        title={Time.toShortMonthDate(item.createdAt)}
      >
        {Time.toRelativeFromNow(item.createdAt)}
      </span>

      <MetaDot />

      <span className="sdm-meta-comments">
        <MessageCircle className="size-3" />
        <span>0</span>
      </span>
    </div>
  )
}
