import { useQuery } from '@tanstack/react-query'
import {
  getAllAttachments,
  type AttachmentListMeta,
} from '@/api/attachments/attachments'
import type { useAttachmentsFilters } from '@/hooks/use-attachments-filters'

type AttachmentsFilters = ReturnType<typeof useAttachmentsFilters>

export function useAttachmentsListQuery(filters: AttachmentsFilters) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'all-attachments',
      filters.pageIndex,
      filters.debouncedSearch,
      filters.patientId,
      filters.date,
      filters.contentType,
    ],
    queryFn: () =>
      getAllAttachments({
        page: filters.pageIndex,
        filter: filters.debouncedSearch || undefined,
        patientId: filters.patientId === 'all' ? undefined : filters.patientId,
        from: filters.date?.from?.toISOString(),
        to: filters.date?.to?.toISOString(),
        contentType: filters.contentType || undefined,
      }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })

  const attachments = data?.attachments ?? []
  const meta: AttachmentListMeta = data?.meta ?? {
    pageIndex: filters.pageIndex,
    perPage: 10,
    totalCount: 0,
    totalStorageSize: 0,
  }

  return { attachments, meta, isLoading, isError }
}
