'use client'

import { useState } from 'react'
import { CloudUpload, Lock, Users, User, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { usePatientsWithAttachments } from '../../hooks/use-patients-with-attachments'
import { useUpload } from '@/hooks/use-upload'
import { DropZone } from './drop-zone'
import { FileList } from './file-list'
import './upload-modal.css'

interface UploadModalProps {
  open: boolean
  onClose: () => void
}

export function UploadModal({ open, onClose }: UploadModalProps) {
  const [patientId, setPatientId] = useState<string>('')
  const {
    files,
    addFiles,
    removeFile,
    clearFiles,
    reset,
    startUpload,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    isUploading,
    pendingCount,
    canUpload,
  } = useUpload()

  const { data: patients, isLoading: patientsLoading } =
    usePatientsWithAttachments({ enabled: open })

  const handleClose = () => {
    if (isUploading) return
    reset()
    setPatientId('')
    onClose()
  }

  const handleUpload = async () => {
    if (!patientId) {
      toast.error('Selecione um paciente antes de enviar.')
      return
    }

    const { doneCount, hasErrors } = await startUpload(patientId)

    if (doneCount > 0) {
      toast.success(
        `${doneCount} ${doneCount === 1 ? 'documento enviado' : 'documentos enviados'} com sucesso.`,
      )
    }

    if (!hasErrors) setTimeout(handleClose, 800)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose()
      }}
    >
      <DialogContent className="pd-up-dialog">
        {/* Head */}
        <div className="pd-up-head">
          <div className="pd-up-head-icon">
            <CloudUpload className="size-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="pd-up-title">Enviar documento</DialogTitle>
            <DialogDescription className="pd-up-desc">
              Adicione anexos clínicos vinculados a um paciente.
            </DialogDescription>
          </div>
          <button
            onClick={handleClose}
            className="pd-up-close"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="pd-up-body">
          <DropZone
            isDragging={isDragging}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFilesSelected={addFiles}
          />

          <FileList files={files} onRemove={removeFile} onClear={clearFiles} />

          {/* Patient selector */}
          <div className="pd-up-field">
            <label className="pd-up-label">
              Paciente <span className="text-destructive">*</span>
            </label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger
                className={cn(
                  'pd-up-select',
                  !patientId && 'text-muted-foreground',
                )}
              >
                <div className="pd-up-select-inner">
                  <Users className="size-3.5 shrink-0 text-muted-foreground" />
                  <SelectValue
                    placeholder={
                      patientsLoading ? 'Carregando...' : 'Selecionar paciente'
                    }
                  />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-[220px]">
                {patients?.map((p) => (
                  <SelectItem
                    key={p.id}
                    value={p.id}
                    className="cursor-pointer py-2.5"
                  >
                    <div className="pd-up-option">
                      <User className="size-3.5 shrink-0 text-blue-500" />
                      <span className="text-sm font-medium">
                        {p.firstName} {p.lastName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="pd-up-footer">
          <div className="pd-up-note">
            <Lock className="size-3" />
            Criptografado em trânsito
          </div>
          <div className="pd-up-footer-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="pd-up-btn-cancel"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="pd-up-btn-submit"
              onClick={handleUpload}
              disabled={!canUpload || !patientId}
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <CloudUpload className="size-3.5" /> Enviar{' '}
                  {pendingCount > 0 ? `(${pendingCount})` : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
