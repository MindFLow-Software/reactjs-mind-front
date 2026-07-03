'use client'

import { useQuery } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { getTotalPsychologists } from '@/api/psychologists/get-total-psychologists'
import { AdminStatCard } from './admin-stat-card'

export const TotalPsychologistsCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-total-psychologists'],
    queryFn: getTotalPsychologists,
  })

  return (
    <AdminStatCard
      icon={<Users className="size-4" />}
      accent="blue"
      title="Total de Psicólogos"
      subtitle="Cadastrados no MindFlush"
      query={{ value: data?.total, isLoading, isError }}
    />
  )
}
