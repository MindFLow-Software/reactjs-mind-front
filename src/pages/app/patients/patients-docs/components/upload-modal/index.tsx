'use client'

import { useState } from 'react'
import { CloudUpload, Lock, Users, User, Loader2, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
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
import { getPatientsWithAttachments } from '@/api/patients/patient-with-attachment'
import { useUpload } from '@/hooks/use-upload'
import { DropZone } from './drop-zone'
import { FileList } from './file-list'

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

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients-with-attachments'],
    queryFn: getPatientsWithAttachments,
    staleTime: 1000 * 60 * 5,
    enabled: open,
  })

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
      <DialogContent className="max-w-[600px] p-0 gap-0 overflow-hidden rounded-2xl flex flex-col max-h-[90vh]">
        {/* Head */}
        <div className="flex items-start gap-3 px-6 py-5 border-b border-border shrink-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
            <CloudUpload className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-[15px] font-bold text-foreground">
              Enviar documento
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground mt-0.5">
              Adicione anexos clínicos vinculados a um paciente.
            </DialogDescription>
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 px-6 py-5 gap-4 overflow-y-auto">
          <DropZone
            isDragging={isDragging}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFilesSelected={addFiles}
          />

          <FileList files={files} onRemove={removeFile} onClear={clearFiles} />

          {/* Patient selector */}
          <div className="flex flex-col flex-1 min-h-0 gap-1.5">
            <label className="text-[13px] font-semibold text-foreground shrink-0">
              Paciente <span className="text-destructive">*</span>
            </label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger
                className={cn(
                  'h-full min-h-[38px] cursor-pointer bg-background border-muted-foreground/20 hover:border-primary/40 transition-all',
                  !patientId && 'text-muted-foreground',
                )}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
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
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-muted/20 shrink-0">
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Lock className="h-3 w-3" />
            Criptografado em trânsito
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="cursor-pointer h-9"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="cursor-pointer h-9 gap-2 min-w-[120px]"
              onClick={handleUpload}
              disabled={!canUpload || !patientId}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <CloudUpload className="h-3.5 w-3.5" /> Enviar{' '}
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
