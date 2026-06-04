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
import { handleFileDownload } from '@/utils/handle-file-download'
import { formatFileSize } from '@/utils/format-file-size'
import type { Attachment } from '@/api/attachments/attachments'
import {
  getFileKind,
  getFileLabel,
  FILE_KIND_STYLES,
} from '@/utils/file-helpers'

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.trim() ?? 'http://localhost:8080'

interface PreviewDrawerProps {
  doc: Attachment | null
  onClose: () => void
  onDelete: (id: string) => void
}

export function PreviewDrawer({ doc, onClose, onDelete }: PreviewDrawerProps) {
  if (!doc) return null

  const { id, filename, contentType, SizeInBytes, uploadedAt, patient } = doc
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
      <SheetContent
        side="right"
        className="w-full sm:max-w-[440px] p-0 flex flex-col gap-0 overflow-hidden"
      >
        {/* Head */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-border shrink-0">
          <div
            className={cn(
              'flex h-11 w-9 shrink-0 items-end justify-center rounded-md bg-gradient-to-br overflow-hidden',
              style.gradient,
            )}
          >
            <span className="mb-1 text-[8px] font-bold text-white/80 tracking-tight">
              {ext}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-[14px] font-semibold text-foreground leading-snug truncate">
              {filename}
            </SheetTitle>
            <SheetDescription className="text-[12px] text-muted-foreground mt-0.5">
              {getFileLabel(contentType)} · {formatFileSize(SizeInBytes)}
            </SheetDescription>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Fechar preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Preview area */}
        <div className="relative flex-1 overflow-hidden bg-muted/30 min-h-0">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/20" />
          </div>

          {kind === 'image' ? (
            <img
              src={fileUrl}
              alt={filename}
              className="relative z-10 h-full w-full object-contain p-4"
              loading="lazy"
            />
          ) : kind === 'pdf' ? (
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0`}
              className="relative z-10 h-full w-full border-none"
              title={`Preview de ${filename}`}
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <FileText className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Formato não suportado
              </p>
              <p className="text-xs text-muted-foreground text-center max-w-[220px]">
                Baixe o arquivo para abri-lo no aplicativo correto.
              </p>
              <Button
                size="sm"
                className="mt-2 gap-2 cursor-pointer"
                onClick={() => handleFileDownload(id, filename)}
              >
                <Download className="h-3.5 w-3.5" />
                Baixar arquivo
              </Button>
            </div>
          )}
        </div>

        {/* Info grid */}
        <div className="border-t border-border px-5 py-4 shrink-0">
          <p className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider mb-3">
            Informações
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5 flex items-center gap-1">
                <User className="h-3 w-3" /> Paciente
              </p>
              <p className="text-[13px] font-semibold text-foreground">
                {patient ? `${patient.firstName} ${patient.lastName}` : '—'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Enviado em
              </p>
              <p className="text-[13px] font-semibold text-foreground">
                {uploadedAt
                  ? format(new Date(uploadedAt), 'dd/MM/yyyy', { locale: ptBR })
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5 flex items-center gap-1">
                <HardDrive className="h-3 w-3" /> Tamanho
              </p>
              <p className="text-[13px] font-semibold text-foreground font-mono">
                {formatFileSize(SizeInBytes)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-0.5 flex items-center gap-1">
                <FileType className="h-3 w-3" /> Tipo
              </p>
              <p className="text-[13px] font-semibold text-foreground">
                {getFileLabel(contentType)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 px-5 py-3 border-t border-border bg-muted/20 shrink-0">
          <Button
            className="flex-1 gap-2 cursor-pointer h-9"
            onClick={() => handleFileDownload(id, filename)}
          >
            <Download className="h-3.5 w-3.5" />
            Baixar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 cursor-pointer text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                    <Trash2 className="h-4 w-4 text-destructive" />
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
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
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
