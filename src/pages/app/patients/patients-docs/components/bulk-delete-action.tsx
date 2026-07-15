'use client'

import { Trash2, Loader2, X, Download } from 'lucide-react'
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
import './bulk-delete-action.css'

interface BulkDeleteActionSelection {
  count: number
  isDeleting?: boolean
}

interface BulkDeleteActionProps {
  selection: BulkDeleteActionSelection
  onConfirm: () => void
  onClear: () => void
}

export function BulkDeleteAction({
  selection,
  onConfirm,
  onClear,
}: BulkDeleteActionProps) {
  const { count: selectedCount, isDeleting } = selection
  if (selectedCount === 0) return null

  return (
    <div className="pd-bulk-wrap">
      <div className="pd-bulk-bar">
        <button
          onClick={onClear}
          className="pd-bulk-clear"
          aria-label="Limpar seleção"
        >
          <X className="size-4" />
        </button>

        <div className="pd-bulk-divider" />

        <span className="pd-bulk-count">
          {selectedCount} {selectedCount === 1 ? 'selecionado' : 'selecionados'}
        </span>

        <div className="pd-bulk-divider" />

        <Button
          variant="secondary"
          size="sm"
          disabled
          className="pd-bulk-download"
        >
          <Download className="size-3.5" />
          Baixar
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              className="pd-bulk-delete-btn"
            >
              {isDeleting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              Excluir
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <div className="pd-bulk-dialog-icon">
                  <Trash2 className="size-4 text-destructive" />
                </div>
                Confirmar exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                Você está prestes a excluir{' '}
                <strong className="text-foreground">{selectedCount}</strong>{' '}
                {selectedCount === 1 ? 'documento' : 'documentos'}{' '}
                permanentemente. Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  onConfirm()
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
              >
                Sim, excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
