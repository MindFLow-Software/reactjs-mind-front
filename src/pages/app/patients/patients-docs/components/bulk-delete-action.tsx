'use client'

import { useState } from 'react'
import { Trash2, Loader2, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog/confirm-dialog'
import './bulk-delete-action.css'

type BulkDeleteActionSelection = {
  count: number
  isDeleting?: boolean
}

type BulkDeleteActionProps = {
  selection: BulkDeleteActionSelection
  onConfirm: () => void
  onClear: () => void
}

export function BulkDeleteAction({
  selection,
  onConfirm,
  onClear,
}: BulkDeleteActionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { count: selectedCount, isDeleting } = selection

  if (selectedCount === 0) return null

  function handleConfirm() {
    onConfirm()
    setConfirmOpen(false)
  }

  return (
    <div className="pd-bulk-wrap">
      <div className="pd-bulk-bar">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          aria-label="Limpar seleção"
          className="pd-bulk-clear"
        >
          <X className="size-4" />
        </Button>

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
          <Download data-icon="inline-start" />
          Baixar
        </Button>

        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={() => setConfirmOpen(true)}
          className="pd-bulk-delete-btn"
        >
          {isDeleting ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Trash2 data-icon="inline-start" />
          )}
          Excluir
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="destructive"
        title="Confirmar exclusão"
        description={
          <>
            Você está prestes a excluir{' '}
            <strong className="text-foreground">{selectedCount}</strong>{' '}
            {selectedCount === 1 ? 'documento' : 'documentos'} permanentemente.
            Esta ação não pode ser desfeita.
          </>
        }
        confirmLabel="Sim, excluir"
        pending={isDeleting}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
