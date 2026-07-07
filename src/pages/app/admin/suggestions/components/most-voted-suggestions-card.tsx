'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, TrendingUp } from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { getMostVotedSuggestions } from '@/api/suggestions/get-most-voted-suggestions'
import { toggleSuggestionLike } from '@/api/suggestions/toggle-suggestion-like'
import { getProfile } from '@/api/psychologists/get-profile'
import { SuggestionCard } from '@/components/suggestion-card'
import './most-voted-suggestions-card.css'

export function MostVotedSuggestionsCard() {
  const queryClient = useQueryClient()

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['admin', 'suggestions', 'most-voted'],
    queryFn: getMostVotedSuggestions,
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { mutate: handleToggleLike } = useMutation({
    mutationFn: (suggestionId: string) => toggleSuggestionLike(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'suggestions', 'most-voted'],
      })
      queryClient.invalidateQueries({ queryKey: ['suggestions'] })
    },
  })

  return (
    <Card className="ads-voted-card">
      <CardHeader className="border-b border-border bg-muted/30 flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">
              Sugestões em Alta
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs font-medium text-muted-foreground">
          Ideias mais apoiadas pela comunidade
        </CardDescription>
      </CardHeader>

      <CardContent className="ads-voted-content">
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {suggestions?.map((item) => (
              <SuggestionCard
                key={item.id}
                item={item}
                userId={profile?.id}
                onLike={handleToggleLike}
              />
            ))}

            {suggestions?.length === 0 && (
              <p className="text-center py-10 text-muted-foreground text-sm italic">
                Nenhuma sugestão votada ainda.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
