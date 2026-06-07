import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  deleteAttachment,
  getPatientAttachments,
} from '@/api/attachments/attachments'
import type { AttachmentPatientItem } from '@/types/attachment'
import type { FileTypeFilter } from '../components/files/file-type-filter'
import { getFileType } from '../components/files/file-type-filter'

interface UsePatientFilesReturn {
  attachments: AttachmentPatientItem[]
  filtered: AttachmentPatientItem[]
  counts: Record<FileTypeFilter, number>
  typeFilter: FileTypeFilter
  previewFile: AttachmentPatientItem | null
  isLoading: boolean
  isDeleting: boolean
  setTypeFilter: (f: FileTypeFilter) => void
  openPreview: (file: AttachmentPatientItem) => void
  closePreview: () => void
  handleDelete: (attachmentId: string) => void
}

export function usePatientFiles(patientId: string): UsePatientFilesReturn {
  const queryClient = useQueryClient()
  const [typeFilter, setTypeFilterState] = useState<FileTypeFilter>('all')
  const [previewFile, setPreviewFile] = useState<AttachmentPatientItem | null>(
    null,
  )

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['patient-hub', patientId, 'attachments'],
    queryFn: () => getPatientAttachments(patientId),
    enabled: Boolean(patientId),
  })

  const sorted = useMemo(
    () =>
      [...attachments].sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      ),
    [attachments],
  )

  const counts = useMemo<Record<FileTypeFilter, number>>(
    () => ({
      all: sorted.length,
      pdf: sorted.filter((file) => getFileType(file.type) === 'pdf').length,
      image: sorted.filter((file) => getFileType(file.type) === 'image').length,
      audio: sorted.filter((file) => getFileType(file.type) === 'audio').length,
    }),
    [sorted],
  )

  const filtered = useMemo(
    () =>
      typeFilter === 'all'
        ? sorted
        : sorted.filter((f) => getFileType(f.type) === typeFilter),
    [sorted, typeFilter],
  )

  const { mutate: removeMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['patient-hub', patientId, 'attachments'],
      })
      toast.success('Arquivo removido.')
    },
    onError: () => toast.error('Erro ao remover arquivo.'),
  })

  const setTypeFilter = useCallback((f: FileTypeFilter) => {
    setTypeFilterState(f)
  }, [])

  const openPreview = useCallback((file: AttachmentPatientItem) => {
    setPreviewFile(file)
  }, [])

  const closePreview = useCallback(() => {
    setPreviewFile(null)
  }, [])

  const handleDelete = useCallback(
    (attachmentId: string) => {
      removeMutation(attachmentId)
    },
    [removeMutation],
  )

  return {
    attachments,
    filtered,
    counts,
    typeFilter,
    previewFile,
    isLoading,
    isDeleting,
    setTypeFilter,
    openPreview,
    closePreview,
    handleDelete,
  }
}
