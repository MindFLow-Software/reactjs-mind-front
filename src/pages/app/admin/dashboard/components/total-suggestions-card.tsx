'use client'

import { useQuery } from '@tanstack/react-query'
import { Inbox } from 'lucide-react'
import { getTotalSuggestionsCard } from '@/api/suggestions/get-total-suggestions-card'
import { AdminStatCard } from './admin-stat-card'

export const TotalSuggestionsCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-total-suggestions'],
    queryFn: getTotalSuggestionsCard,
  })

  return (
    <AdminStatCard
      icon={<Inbox className="size-4" />}
      accent="amber"
      title="Total de Sugestões"
      subtitle="Feedbacks do MindFlush"
      query={{ value: data?.total, isLoading, isError }}
    />
  )
}
