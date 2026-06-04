'use client'

import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/api/psychologists/get-profile'

export function usePsychologistProfile() {
  return useQuery({
    queryKey: ['psychologist-profile-v2'], // Chave única para o psicólogo
    queryFn: getProfile,
    staleTime: 1000 * 60 * 10, // 10 minutos de cache
  })
}
