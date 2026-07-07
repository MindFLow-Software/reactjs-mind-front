import { getPsychologistProfileById } from '@/api/psychologists/get-psychologist-profile-by-id'
import { useQuery } from '@tanstack/react-query'

export function usePsychologistProfile(psychologistProfileId: string | null) {
  return useQuery({
    queryKey: ['psychologist-profile-v2', psychologistProfileId], // Chave única para o psicólogo
    queryFn: () => getPsychologistProfileById(psychologistProfileId),
    staleTime: 1000 * 60 * 10, // 10 minutos de cache
  })
}
