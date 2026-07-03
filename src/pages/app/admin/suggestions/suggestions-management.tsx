'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useHeaderStore } from '@/store/use-header-store'
import { getSuggestions } from '@/api/suggestions/get-suggestions'
import { updateSuggestionStatus } from '@/api/suggestions/update-suggestion-status'
import { RoadmapCard } from './components/roadmap-card'
import { RoadmapFilters } from './components/roadmap-filters'
import './suggestions-management.css'

export function SuggestionsManagement() {
  const queryClient = useQueryClient()
  const { setTitle } = useHeaderStore()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    setTitle('Controle de Sugestões')
  }, [setTitle])

  const handleFiltersChange = useCallback(
    (filters: { search?: string; category?: string }) => {
      if (filters.search !== undefined) setSearch(filters.search)
      if (filters.category !== undefined) setCategory(filters.category)
    },
    [],
  )

  const handleClearFilters = useCallback(() => {
    setSearch('')
    setCategory('all')
  }, [])

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['admin', 'roadmap', search, category],
    queryFn: () =>
      getSuggestions({
        status: ['OPEN', 'UNDER_REVIEW', 'PLANNED', 'IMPLEMENTED'],
        search: search || undefined,
        category: category === 'all' ? undefined : category,
      }),
  })

  const { mutate: changeStatus, isPending } = useMutation({
    mutationFn: updateSuggestionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] })
      queryClient.removeQueries({ queryKey: ['suggestions', 'ranking'] })
      toast.success('Fase atualizada!')
    },
  })

  return (
    <div className="ads-management-root">
      <Helmet title="Controle de Sugestões" />

      <RoadmapFilters
        search={search}
        category={category}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <div className="ads-management-loading">
          <Loader2 className="animate-spin opacity-20 text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {suggestions?.map((item) => (
            <RoadmapCard
              key={item.id}
              item={item}
              onStatusChange={(id, s) => changeStatus({ id, status: s })}
              isUpdating={isPending}
            />
          ))}

          {!isLoading && suggestions?.length === 0 && (
            <div className="ads-management-empty">
              <p className="text-sm font-medium italic text-muted-foreground">
                Nenhuma sugestão encontrada.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
