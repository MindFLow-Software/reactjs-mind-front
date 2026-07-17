'use client'

import { useState, memo } from 'react'
import { Eye, ArrowDownToLine, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Files } from '@/utils/files'
import { Time } from '@/utils/time'
import { cn } from '@/lib/utils'
import type { IAttachmentPatientItem } from '@/types/attachment/attachment-patient-item'

import './file-card.css'

type IFileCard = {
  file: IAttachmentPatientItem
  onPreview: (file: IAttachmentPatientItem) => void
  onDelete: (id: string) => void
}

function getTypeBadge(mime: string): { label: string; className: string } {
  if (mime.includes('pdf'))
    return { label: 'PDF', className: 'bg-red-600 text-white' }
  if (mime.includes('image'))
    return { label: 'IMG', className: 'bg-teal-600 text-white' }
  if (mime.includes('audio'))
    return { label: 'ÁUD', className: 'bg-violet-600 text-white' }
  return { label: 'DOC', className: 'bg-gray-500 text-white' }
}

export const FileCard = memo(function FileCard({
  file,
  onPreview,
  onDelete,
}: IFileCard) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const badge = getTypeBadge(file.type)
  const dateLabel = file.uploadedAt
    ? Time.toDayMonthYearAbbrev(file.uploadedAt)
    : '—'

  return (
    <>
      <div className="ph-file-card">
        <div className={cn('ph-file-card__badge', badge.className)}>
          {badge.label}
        </div>

        <div className="ph-file-card__info">
          <p className="ph-file-card__name" title={file.filename}>
            {file.filename}
          </p>
          <p className="ph-file-card__meta">
            {Files.formatSize(file.size)} · {dateLabel}
          </p>
        </div>

        <div className="ph-file-card__actions">
          <Button
            variant="ghost"
            size="icon"
            className="ph-file-card__action-btn"
            onClick={() => onPreview(file)}
          >
            <Eye className="ph-file-card__action-icon" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ph-file-card__action-btn"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              Files.download(file.id, file.filename)
            }}
          >
            <ArrowDownToLine className="ph-file-card__action-icon" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ph-file-card__action-btn--danger"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="ph-file-card__action-icon" />
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover arquivo?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="ph-file-card__dialog-filename">
                {file.filename}
              </span>{' '}
              será removido permanentemente. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="ph-file-card__dialog-cancel">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="ph-file-card__dialog-confirm"
              onClick={() => onDelete(file.id)}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})
