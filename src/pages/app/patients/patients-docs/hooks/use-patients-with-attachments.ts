import { useQuery } from '@tanstack/react-query'
import { getPatientsWithAttachments } from '@/api/patient-profiles/patient-with-attachment'

type UsePatientsWithAttachmentsOptions = {
  enabled?: boolean
}

export function usePatientsWithAttachments({
  enabled = true,
}: UsePatientsWithAttachmentsOptions = {}) {
  return useQuery({
    queryKey: ['patients-with-attachments'],
    queryFn: getPatientsWithAttachments,
    staleTime: 1000 * 60 * 5,
    enabled,
  })
}
