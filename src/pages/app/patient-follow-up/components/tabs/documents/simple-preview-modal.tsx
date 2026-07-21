'use client'

import { useMemo } from 'react'
import { FileText, ArrowDownToLine, Loader2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Files } from '@/utils/files'
import type { IAttachmentPatientItem } from '@/types/attachment/attachment-patient-item'
import './simple-preview-modal.css'

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)$/i

type ISimplePreviewModal = {
  file: IAttachmentPatientItem | null
  onClose: () => void
}

const isImageMime = (mime: string, name: string) => {
  return mime.includes('image') || IMAGE_EXTENSIONS.test(name)
}

const isPdfMime = (mime: string, name: string) => {
  return mime.includes('pdf') || name.endsWith('.pdf')
}

function getDownloadLabel(isImage: boolean, isPDF: boolean): string {
  if (isImage) return 'Imagem'
  if (isPDF) return 'PDF'
  return 'Arquivo'
}

function renderPreviewBody(
  isImage: boolean,
  isPDF: boolean,
  fileUrl: string,
  fileName: string,
) {
  if (isImage) {
    return (
      <img
        src={fileUrl}
        alt={fileName}
        className="ph-preview__img"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
    )
  }

  if (isPDF) {
    return (
      <iframe
        src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        className="ph-preview__iframe"
        title="Visualização de PDF"
      />
    )
  }

  return (
    <div className="ph-preview__unsupported">
      <div className="ph-preview__unsupported-icon-wrap">
        <FileText className="ph-preview__unsupported-icon" />
      </div>
      <p className="ph-preview__unsupported-title">Formato não suportado</p>
      <p className="ph-preview__unsupported-desc">
        Não é possível visualizar este tipo de arquivo. Faça o download para
        abri-lo.
      </p>
    </div>
  )
}

export function SimplePreviewModal({ file, onClose }: ISimplePreviewModal) {
  const fileUrl = useMemo(
    () => (file ? Files.attachmentUrl(file.id) : ''),
    [file],
  )

  if (!file) return null

  const { id, filename: fileName } = file
  const fileMime = file.type.toLowerCase()
  const lowerFileName = fileName.toLowerCase()
  const isImage = isImageMime(fileMime, lowerFileName)
  const isPDF = !isImage && isPdfMime(fileMime, lowerFileName)
  const downloadLabel = getDownloadLabel(isImage, isPDF)

  return (
    <Dialog open={Boolean(file)} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="ph-preview">
        <div className="ph-preview__header">
          <div className="ph-preview__title-wrap">
            <DialogTitle className="ph-preview__title" title={fileName}>
              {fileName}
            </DialogTitle>
            <DialogDescription className="ph-preview__subtitle">
              MindFlush · Visualizador de Alta Precisão
            </DialogDescription>
          </div>
          <button onClick={onClose} className="ph-preview__close-btn">
            <X className="size-4" />
          </button>
        </div>

        <div className="ph-preview__accent-bar" />

        <div className="ph-preview__viewer">
          <div className="ph-preview__loader">
            <Loader2 className="ph-preview__loader-icon" />
          </div>

          {renderPreviewBody(isImage, isPDF, fileUrl, fileName)}
        </div>

        <div className="ph-preview__footer">
          <Button
            variant="ghost"
            size="sm"
            className="ph-preview__close-action"
            onClick={onClose}
          >
            Fechar
          </Button>
          <Button
            size="sm"
            className="ph-preview__download-btn"
            onClick={() => Files.download(id, fileName)}
          >
            <ArrowDownToLine className="size-3.5" />
            Baixar {downloadLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
