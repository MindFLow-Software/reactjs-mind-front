'use client'

import { Loader2, FileSearch } from 'lucide-react'

import { FileUploadZone } from './file-upload-zone'
import { FileTypeFilter, FileType } from './file-type-filter'
import { FileCard } from './file-card'
import { SimplePreviewModal } from './simple-preview-modal'
import { usePatientFiles } from '../../../hooks/use-patient-files'
import './patient-files-tab.css'

const EMPTY_LABEL: Record<FileType, string> = {
  [FileType.ALL]: 'Nenhum arquivo encontrado.',
  [FileType.PDF]: 'Nenhum PDF encontrado.',
  [FileType.IMAGE]: 'Nenhuma imagem encontrada.',
  [FileType.AUDIO]: 'Nenhum áudio encontrado.',
}

type IPatientFilesTab = {
  patientId: string
}

export function PatientFilesTab({ patientId }: IPatientFilesTab) {
  const {
    filtered,
    counts,
    typeFilter,
    previewFile,
    isLoading,
    setTypeFilter,
    openPreview,
    closePreview,
    handleDelete,
  } = usePatientFiles(patientId)

  function renderFiles() {
    if (isLoading) {
      return (
        <div className="df-tab__loading">
          <Loader2 className="df-tab__loading-icon" />
          <p className="df-tab__loading-label">Sincronizando arquivos...</p>
        </div>
      )
    }

    if (filtered.length === 0) {
      return (
        <div className="df-tab__empty">
          <FileSearch className="df-tab__empty-icon" />
          <p className="df-tab__empty-label">{EMPTY_LABEL[typeFilter]}</p>
        </div>
      )
    }

    return (
      <div className="df-tab__list">
        {filtered.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onPreview={openPreview}
            onDelete={handleDelete}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="df-tab">
      <div className="df-tab__card">
        <div className="df-tab__head">
          <div>
            <p className="df-tab__title">Documentos emitidos</p>
            <p className="df-tab__subtitle">
              Relatórios, laudos, atestados e anexos do paciente
            </p>
          </div>
        </div>

        <FileUploadZone patientId={patientId} />

        <FileTypeFilter
          filter={typeFilter}
          counts={counts}
          onFilterChange={setTypeFilter}
        />

        {renderFiles()}
      </div>

      <SimplePreviewModal file={previewFile} onClose={closePreview} />
    </div>
  )
}
