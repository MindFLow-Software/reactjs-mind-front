import { getActiveRegistrationLink } from '@/api/registration-link/get-active-registration-link'
import { useQuery } from '@tanstack/react-query'

export function useActiveRegistrationLink() {
  return useQuery({
    queryKey: ['active-registration-link'],
    queryFn: getActiveRegistrationLink,
  })
}
