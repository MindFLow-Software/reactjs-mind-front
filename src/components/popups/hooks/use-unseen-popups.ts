import { useQuery } from '@tanstack/react-query'
import { fetchUnseenPopups } from '@/api/popups/fetch-unseen-popups'

export function useUnseenPopups() {
  return useQuery({
    queryKey: ['unseen-popups'],
    queryFn: fetchUnseenPopups,
    staleTime: Infinity,
  })
}
