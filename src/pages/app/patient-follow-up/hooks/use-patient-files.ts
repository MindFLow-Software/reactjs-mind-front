import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteAttachment } from '@/api/attachments/delete-attachment'
import { getPatientAttachments } from '@/api/attachments/get-patient-attachments'
import type { IAttachmentPatientItem } from '@/types/attachment/attachment-patient-item'
import {
  FileType,
  getFileType,
} from '../components/tabs/documents/file-type-filter'
import { Time } from '@/utils/time'

export function patientAttachmentsQueryKey(patientId: string) {
  return ['patient-hub', patientId, 'attachments'] as const
}

type IUsePatientFilesReturn = {
  attachments: IAttachmentPatientItem[]
  filtered: IAttachmentPatientItem[]
  counts: Record<FileType, number>
  typeFilter: FileType
  previewFile: IAttachmentPatientItem | null
  isLoading: boolean
  isDeleting: boolean
  setTypeFilter: (f: FileType) => void
  openPreview: (file: IAttachmentPatientItem) => void
  closePreview: () => void
  handleDelete: (attachmentId: string) => void
}

export function usePatientFiles(patientId: string): IUsePatientFilesReturn {
  const queryClient = useQueryClient()
  const [typeFilter, setTypeFilterState] = useState<FileType>(FileType.ALL)
  const [previewFile, setPreviewFile] = useState<IAttachmentPatientItem | null>(
    null,
  )

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: patientAttachmentsQueryKey(patientId),
    queryFn: () => getPatientAttachments(patientId),
    enabled: Boolean(patientId),
  })

  const sorted = useMemo(
    () =>
      [...attachments].sort(
        (a, b) => Time.timestamp(b.uploadedAt) - Time.timestamp(a.uploadedAt),
      ),
    [attachments],
  )

  const counts = useMemo<Record<FileType, number>>(
    () => ({
      [FileType.ALL]: sorted.length,
      [FileType.PDF]: sorted.filter(
        (file) => getFileType(file.type) === FileType.PDF,
      ).length,
      [FileType.IMAGE]: sorted.filter(
        (file) => getFileType(file.type) === FileType.IMAGE,
      ).length,
      [FileType.AUDIO]: sorted.filter(
        (file) => getFileType(file.type) === FileType.AUDIO,
      ).length,
    }),
    [sorted],
  )

  const filtered = useMemo(
    () =>
      typeFilter === FileType.ALL
        ? sorted
        : sorted.filter((f) => getFileType(f.type) === typeFilter),
    [sorted, typeFilter],
  )

  const { mutate: removeMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientAttachmentsQueryKey(patientId),
      })
      toast.success('Arquivo removido.')
    },
    onError: () => toast.error('Erro ao remover arquivo.'),
  })

  const setTypeFilter = useCallback((f: FileType) => {
    setTypeFilterState(f)
  }, [])

  const openPreview = useCallback((file: IAttachmentPatientItem) => {
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
