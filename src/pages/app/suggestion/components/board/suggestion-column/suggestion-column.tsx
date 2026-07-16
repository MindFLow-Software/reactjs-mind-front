'use client'

import type React from 'react'
import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import { getProfile } from '@/api/auth/get-profile'
import { useToggleSuggestionLike } from '@/hooks/use-toggle-suggestion-like'
import { SuggestionCard } from '@/components/suggestion-card'
import './suggestion-column.css'

const PAGE_SIZE = 5

type IColumnMeta = {
  title: string
  icon: React.ReactNode
  badgeClass: string
}

type ISuggestionColumn = {
  column: IColumnMeta
  suggestions?: ISuggestion[]
  isLoading: boolean
}

export function SuggestionColumn({
  column,
  suggestions = [],
  isLoading,
}: ISuggestionColumn) {
  const { title, icon, badgeClass } = column
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { toggleLike } = useToggleSuggestionLike({ userId: profile?.id })

  const sortedSuggestions = useMemo(
    () => [...suggestions].sort((a, b) => b.likesCount - a.likesCount),
    [suggestions],
  )

  const visible = sortedSuggestions.slice(0, visibleCount)
  const remaining = sortedSuggestions.length - visibleCount

  function renderColumnBody() {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="scol-skeleton" />
          ))}
        </div>
      )
    }

    if (sortedSuggestions.length === 0) {
      return (
        <div className="scol-empty">
          <p className="text-center p-6 text-muted-foreground text-xs italic font-medium">
            Nenhuma sugestão por aqui...
          </p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        {visible.map((item) => (
          <SuggestionCard
            key={item.id}
            item={item}
            userId={profile?.id}
            onLike={toggleLike}
          />
        ))}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="scol-load-more"
          >
            <ChevronDown className="size-3.5" />
            Ver mais {Math.min(remaining, PAGE_SIZE)}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="scol-root">
      <header className="scol-header">
        <span className="text-base leading-none">{icon}</span>
        <span className="scol-title">{title}</span>
        <span className={cn('scol-badge', badgeClass)}>
          {suggestions.length}
        </span>
      </header>

      <div className="scol-body">{renderColumnBody()}</div>
    </div>
  )
}
