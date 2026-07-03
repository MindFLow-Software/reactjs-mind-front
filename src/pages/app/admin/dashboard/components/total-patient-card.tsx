'use client'

import { useQuery } from '@tanstack/react-query'
import { HeartHandshake } from 'lucide-react'
import { getTotalPatientsCard } from '@/api/metrics/get-total-patients-card'
import { AdminStatCard } from './admin-stat-card'

export const TotalPatientCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-total-patients'],
    queryFn: getTotalPatientsCard,
  })

  return (
    <AdminStatCard
      icon={<HeartHandshake className="size-4" />}
      accent="red"
      title="Total de Pacientes"
      subtitle="Cadastrados no MindFlush"
      query={{ value: data?.total, isLoading, isError }}
    />
  )
}
