'use client'

import { useState, memo } from 'react'
import { FileText, Eye, ArrowDownToLine, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog/confirm-dialog'
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
    return {
      label: 'PDF',
      className: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300',
    }
  if (mime.includes('image'))
    return {
      label: 'Imagem',
      className:
        'bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300',
    }
  if (mime.includes('audio'))
    return {
      label: 'Áudio',
      className:
        'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300',
    }
  return {
    label: 'Documento',
    className: 'bg-muted text-muted-foreground',
  }
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
      <div className="df-file-row">
        <div className="df-file-row__icon">
          <FileText className="size-4" />
        </div>

        <div className="df-file-row__body">
          <div className="df-file-row__name-line">
            <p className="df-file-row__name" title={file.filename}>
              {file.filename}
            </p>
            <span className={cn('df-file-row__badge', badge.className)}>
              {badge.label}
            </span>
          </div>
          <p className="df-file-row__meta">
            {dateLabel} · {Files.formatSize(file.size)}
          </p>
        </div>

        <div className="df-file-row__actions">
          <Button
            variant="ghost"
            size="icon"
            className="df-file-row__action-btn"
            onClick={() => onPreview(file)}
          >
            <Eye className="df-file-row__action-icon" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="df-file-row__action-btn"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              Files.download(file.id, file.filename)
            }}
          >
            <ArrowDownToLine className="df-file-row__action-icon" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="df-file-row__action-btn--danger"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="df-file-row__action-icon" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="destructive"
        title="Remover arquivo?"
        description={
          <>
            <span className="df-file-row__dialog-filename">
              {file.filename}
            </span>{' '}
            será removido permanentemente. Esta ação não pode ser desfeita.
          </>
        }
        confirmLabel="Remover"
        onConfirm={() => {
          onDelete(file.id)
          setConfirmOpen(false)
        }}
      />
    </>
  )
})
