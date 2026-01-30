"use client"

import type React from "react"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import type { Suggestion } from "@/api/get-suggestions"
import { toggleSuggestionLike } from "@/api/toggle-suggestion-like"
import { getProfile } from "@/api/get-profile"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SuggestionCard } from "@/components/suggestion-card"

interface SuggestionColumnProps {
    title: string
    icon: React.ReactNode
    color: string
    dotColor: string
    suggestions?: Suggestion[]
    isLoading: boolean
}

export function SuggestionColumn({ title, icon, color, dotColor, suggestions = [], isLoading }: SuggestionColumnProps) {
    const queryClient = useQueryClient()

    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    })

    const sortedSuggestions = useMemo(() => {
        return [...suggestions].sort((a, b) => b.likesCount - a.likesCount)
    }, [suggestions])

    const { mutate: handleToggleLike } = useMutation({
        mutationFn: (suggestionId: string) => toggleSuggestionLike(suggestionId),
        onMutate: async (suggestionId) => {
            await queryClient.cancelQueries({ queryKey: ["suggestions"] })
            const previousQueries = queryClient.getQueriesData<Suggestion[]>({ queryKey: ["suggestions"] })

            queryClient.setQueriesData<Suggestion[]>({ queryKey: ["suggestions"] }, (old) => {
                return old?.map((suggestion) => {
                    if (suggestion.id === suggestionId) {
                        const userId = profile?.id ?? ""
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
            })

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
            queryClient.invalidateQueries({ queryKey: ["suggestions"] })
        },
    })

    return (
        <div className="flex flex-col w-full bg-card rounded-xl border border-border h-full overflow-hidden shadow-sm transition-colors">
            <header className={cn("p-4 flex items-center gap-2.5 font-semibold text-sm text-foreground shrink-0 border-b border-border", color)}>
                <div className={cn("size-2 rounded-full animate-pulse", dotColor)} />
                <span className="text-base">{icon}</span>
                <span className="truncate flex-1 uppercase tracking-wider text-[11px] font-bold">{title}</span>
                <span className="text-[10px] bg-background/50 backdrop-blur-md px-2 py-0.5 rounded-full font-bold text-muted-foreground border border-border">
                    {suggestions.length}
                </span>
            </header>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 scroll-smooth scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/20">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-muted/50 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : sortedSuggestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 opacity-50">
                        <p className="text-center p-6 text-muted-foreground text-xs italic font-medium">Nenhuma sugestão por aqui...</p>
                    </div>
                ) : (
                    sortedSuggestions.map((item) => (
                        <SuggestionCard
                            key={item.id}
                            item={item}
                            userId={profile?.id}
                            onLike={handleToggleLike}
                        />
                    ))
                )}
            </div>
        </div>
    )
}