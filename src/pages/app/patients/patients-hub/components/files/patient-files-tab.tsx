'use client'

import { useState, useMemo } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Loader2, FileSearch } from 'lucide-react'
import { toast } from 'sonner'

import { getPatientAttachments } from '@/api/attachments/get-patient-attachments'
import { deleteAttachment } from '@/api/attachments/delete-attachment'
import type { IAttachmentPatientItem } from '@/types/attachment/attachment-patient-item'
import { FileUploadZone } from './file-upload-zone'
import { FileTypeFilter, getFileType } from './file-type-filter'
import type { FileTypeFilter as FileTypeFilterEnum } from './file-type-filter'
import { FileCard } from './file-card'
import { SimplePreviewModal } from './simple-preview-modal'
import './patient-files-tab.css'

const EMPTY_LABEL: Record<FileTypeFilterEnum, string> = {
  all: 'Nenhum arquivo encontrado.',
  pdf: 'Nenhum PDF encontrado.',
  image: 'Nenhuma imagem encontrada.',
  audio: 'Nenhum áudio encontrado.',
}

export function PatientFilesTab({ patientId }: { patientId: string }) {
  const queryClient = useQueryClient()

  const [typeFilter, setTypeFilter] = useState<FileTypeFilterEnum>('all')
  const [previewFile, setPreviewFile] = useState<IAttachmentPatientItem | null>(
    null,
  )

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['patient-attachments', patientId],
    queryFn: () => getPatientAttachments(patientId),
    enabled: Boolean(patientId),
  })

  // ToDo: sort on backend, not on front
  const sorted = useMemo(
    () =>
      [...attachments].sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      ),
    [attachments],
  )

  const counts = useMemo<Record<FileTypeFilterEnum, number>>(
    () => ({
      all: sorted.length,
      pdf: sorted.filter((f) => getFileType(f.type) === 'pdf').length,
      image: sorted.filter((f) => getFileType(f.type) === 'image').length,
      audio: sorted.filter((f) => getFileType(f.type) === 'audio').length,
    }),
    [sorted],
  )

  // ToDo: filter on backend, not on front
  const filtered = useMemo(
    () =>
      typeFilter === 'all'
        ? sorted
        : sorted.filter((f) => getFileType(f.type) === typeFilter),
    [sorted, typeFilter],
  )

  const { mutate: removeFile } = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['patient-attachments', patientId],
      })
      toast.success('Arquivo removido.')
    },
    onError: () => toast.error('Erro ao remover arquivo.'),
  })

  return (
    <div className="ph-files-tab">
      <FileUploadZone patientId={patientId} />

      <FileTypeFilter
        filter={typeFilter}
        counts={counts}
        onFilterChange={setTypeFilter}
      />

      {isLoading ? (
        <div className="ph-files-tab__loading">
          <Loader2 className="ph-files-tab__loading-icon" />
          <p className="ph-files-tab__loading-label">
            Sincronizando arquivos...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ph-files-tab__empty">
          <FileSearch className="ph-files-tab__empty-icon" />
          <p className="ph-files-tab__empty-label">{EMPTY_LABEL[typeFilter]}</p>
        </div>
      ) : (
        <div className="ph-files-tab__grid">
          {filtered.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onPreview={setPreviewFile}
              onDelete={removeFile}
            />
          ))}
        </div>
      )}

      <SimplePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  )
}
