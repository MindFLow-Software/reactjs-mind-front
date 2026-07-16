import './delete-attachments-button.css'
import { useState, type MouseEvent } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type IDeleteActionButton = {
  onDelete: () => Promise<void>
  itemName?: string
  isLoading?: boolean
}

export function DeleteActionButton({
  onDelete,
  itemName,
  isLoading = false,
}: IDeleteActionButton) {
  const [open, setOpen] = useState(false)

  async function handleConfirm(event: MouseEvent) {
    event.preventDefault()

    try {
      await onDelete()
      setOpen(false)
    } catch {
      toast.error('Erro ao excluir o arquivo.')
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading}
          className="rp-delete-btn"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rp-delete-dialog">
        <AlertDialogHeader>
          <div className="rp-delete-dialog__header">
            <div className="rp-delete-dialog__icon">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="rp-delete-dialog__title">
              Excluir arquivo?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="rp-delete-dialog__desc">
            A exclusão de{' '}
            <span className="rp-delete-dialog__item">{itemName}</span> é
            permanente e não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="rp-delete-dialog__footer">
          <AlertDialogCancel
            disabled={isLoading}
            className="rp-delete-dialog__cancel"
          >
            Cancelar
          </AlertDialogCancel>
          <Button onClick={handleConfirm} className="rp-delete-dialog__confirm">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Sim, Excluir'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
