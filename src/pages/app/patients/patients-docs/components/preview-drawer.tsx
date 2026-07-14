'use client'

import {
  FileText,
  Download,
  Trash2,
  Loader2,
  X,
  User,
  Calendar,
  HardDrive,
  FileType,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { env } from '@/env'
import { handleFileDownload } from '@/utils/handle-file-download'
import { formatFileSize } from '@/utils/format-file-size'
import type { IAttachmentListItem as Attachment } from '@/types/attachment/attachment-list-item'
import {
  getFileKind,
  getFileLabel,
  FILE_KIND_STYLES,
} from '@/utils/file-helpers'
import './preview-drawer.css'

const BACKEND_URL = env.VITE_API_URL

interface PreviewDrawerProps {
  doc: Attachment | null
  onClose: () => void
  onDelete: (id: string) => void
}

export function PreviewDrawer({ doc, onClose, onDelete }: PreviewDrawerProps) {
  if (!doc) return null

  const { id, filename, contentType, sizeInBytes, uploadedAt, patient } = doc
  const kind = getFileKind(contentType)
  const style = FILE_KIND_STYLES[kind]
  const fileUrl = `${BACKEND_URL}/attachments/${id}`
  const ext = filename.split('.').pop()?.toUpperCase().slice(0, 4) ?? 'FILE'

  return (
    <Sheet
      open={!!doc}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent side="right" className="pd-prev-sheet">
        {/* Head */}
        <div className="pd-prev-head">
          <div className={cn('pd-prev-thumb', style.gradient)}>
            <span className="pd-prev-thumb-ext">{ext}</span>
          </div>
          <div className="min-w-0 flex-1">
            <SheetTitle className="pd-prev-title">{filename}</SheetTitle>
            <SheetDescription className="pd-prev-desc">
              {getFileLabel(contentType)} · {formatFileSize(sizeInBytes)}
            </SheetDescription>
          </div>
          <button
            onClick={onClose}
            className="pd-prev-close"
            aria-label="Fechar preview"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Preview area */}
        <div className="pd-prev-area">
          <div className="pd-prev-loader">
            <Loader2 className="size-6 animate-spin text-muted-foreground/20" />
          </div>

          {kind === 'image' ? (
            <img
              src={fileUrl}
              alt={filename}
              className="pd-prev-img"
              loading="lazy"
            />
          ) : kind === 'pdf' ? (
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0`}
              className="pd-prev-iframe"
              title={`Preview de ${filename}`}
            />
          ) : (
            <div className="pd-prev-unsupported">
              <div className="pd-prev-unsupported-icon">
                <FileText className="size-7 text-muted-foreground/40" />
              </div>
              <p className="pd-prev-unsupported-title">Formato não suportado</p>
              <p className="pd-prev-unsupported-sub">
                Baixe o arquivo para abri-lo no aplicativo correto.
              </p>
              <Button
                size="sm"
                className="mt-2 cursor-pointer gap-2"
                onClick={() => handleFileDownload(id, filename)}
              >
                <Download className="size-3.5" />
                Baixar arquivo
              </Button>
            </div>
          )}
        </div>

        {/* Info grid */}
        <div className="pd-prev-info">
          <p className="pd-prev-info-title">Informações</p>
          <div className="pd-prev-info-grid">
            <div>
              <p className="pd-prev-info-label">
                <User className="size-3" /> Paciente
              </p>
              <p className="pd-prev-info-value">
                {patient ? `${patient.firstName} ${patient.lastName}` : '—'}
              </p>
            </div>
            <div>
              <p className="pd-prev-info-label">
                <Calendar className="size-3" /> Enviado em
              </p>
              <p className="pd-prev-info-value">
                {uploadedAt
                  ? format(new Date(uploadedAt), 'dd/MM/yyyy', { locale: ptBR })
                  : '—'}
              </p>
            </div>
            <div>
              <p className="pd-prev-info-label">
                <HardDrive className="size-3" /> Tamanho
              </p>
              <p className="pd-prev-info-value font-mono">
                {formatFileSize(sizeInBytes)}
              </p>
            </div>
            <div>
              <p className="pd-prev-info-label">
                <FileType className="size-3" /> Tipo
              </p>
              <p className="pd-prev-info-value">{getFileLabel(contentType)}</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pd-prev-footer">
          <Button
            className="pd-prev-download"
            onClick={() => handleFileDownload(id, filename)}
          >
            <Download className="size-3.5" />
            Baixar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="pd-prev-delete">
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <div className="pd-prev-alert-icon">
                    <Trash2 className="size-4 text-destructive" />
                  </div>
                  Excluir documento
                </AlertDialogTitle>
                <AlertDialogDescription>
                  O arquivo{' '}
                  <strong className="text-foreground">{filename}</strong> será
                  removido. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  className="pd-prev-alert-action"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SheetContent>
    </Sheet>
  )
}
