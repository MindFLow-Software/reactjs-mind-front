'use client'

import type React from 'react'
import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Suggestion } from '@/api/suggestions/get-suggestions'
import { toggleSuggestionLike } from '@/api/suggestions/toggle-suggestion-like'
import { getProfile } from '@/api/psychologists/get-profile'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SuggestionCard } from '@/components/suggestion-card'

const PAGE_SIZE = 5

interface SuggestionColumnProps {
  title: string
  icon: React.ReactNode
  badgeClass: string
  suggestions?: Suggestion[]
  isLoading: boolean
}

export function SuggestionColumn({
  title,
  icon,
  badgeClass,
  suggestions = [],
  isLoading,
}: SuggestionColumnProps) {
  const queryClient = useQueryClient()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const sortedSuggestions = useMemo(() => {
    return [...suggestions].sort((a, b) => b.likesCount - a.likesCount)
  }, [suggestions])

  const visible = sortedSuggestions.slice(0, visibleCount)
  const remaining = sortedSuggestions.length - visibleCount

  const { mutate: handleToggleLike } = useMutation({
    mutationFn: (suggestionId: string) => toggleSuggestionLike(suggestionId),
    onMutate: async (suggestionId) => {
      await queryClient.cancelQueries({ queryKey: ['suggestions'] })
      const previousQueries = queryClient.getQueriesData<Suggestion[]>({
        queryKey: ['suggestions'],
      })

      queryClient.setQueriesData<Suggestion[]>(
        { queryKey: ['suggestions'] },
        (old) => {
          return old?.map((suggestion) => {
            if (suggestion.id === suggestionId) {
              const userId = profile?.id ?? ''
              const isLiked = suggestion.likes.includes(userId)
              const newLikes = isLiked
                ? suggestion.likes.filter((id) => id !== userId)
                : [...suggestion.likes, userId]

              return {
                ...suggestion,
                likes: newLikes,
                likesCount: newLikes.length,
              }
            }
            return suggestion
          })
        },
      )

      return { previousQueries }
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] })
    },
  })

  return (
    <div className="flex flex-col w-full h-full min-h-0 overflow-hidden">
      <header className="px-1 pb-3 flex items-center gap-2 shrink-0">
        <span className="text-base leading-none">{icon}</span>
        <span className="flex-1 uppercase tracking-widest text-[11px] font-bold text-foreground truncate">
          {title}
        </span>
        <span
          className={cn(
            'text-xs font-bold px-2.5 py-0.5 rounded-full tabular-nums',
            badgeClass,
          )}
        >
          {suggestions.length}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0 py-0.5 scroll-smooth scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/20">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[110px] bg-muted/50 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : sortedSuggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 opacity-50">
            <p className="text-center p-6 text-muted-foreground text-xs italic font-medium">
              Nenhuma sugestão por aqui...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((item) => (
              <SuggestionCard
                key={item.id}
                item={item}
                userId={profile?.id}
                onLike={handleToggleLike}
              />
            ))}

            {remaining > 0 && (
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground border border-dashed border-border hover:border-border/80 hover:bg-muted/50 transition-all cursor-pointer"
              >
                <ChevronDown className="size-3.5" />
                Ver mais {Math.min(remaining, PAGE_SIZE)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
